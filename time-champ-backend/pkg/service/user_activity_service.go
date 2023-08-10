package service

import (
	"log"
	"net/http"
	"sort"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/constant/message"
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/enum"
	"github.com/tracker/pkg/repository"
)

func GetUserActivity(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, er := strconv.Atoi(c.Param("id"))
	if er != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.PATHVARIABLE_CONVERSION_TO_INT_FAILED})
		return
	}
	userActivity, af := repository.DB().GetUserActivity(uint(id))
	if af.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: af.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, userActivity)
}

func setWorkingStatus(userAc dto.UserActivity) dto.UserActivity {
	userAc.Reason = constant.NULL
	if userAc.ActivityStatus == enum.Activity_WORKING {
		userAc.WorkingStatus = enum.WORKING_STATUS
	} else if userAc.ActivityStatus == enum.Activity_OFFLINE {
		userAc.WorkingStatus = enum.NON_WORKING_STATUS
	} else if userAc.ActivityStatus == enum.Activity_BREAK {
		userAc.WorkingStatus = enum.NON_WORKING_STATUS
	}
	return userAc
}

func userActivityMaxDate(userAttendanceId uint, trx repository.DbInstance, start_time time.Time) (dto.UserActivity, int64, error) {
	userActivity, aff := trx.GetUserActivityByMaxDate(userAttendanceId)
	currentFrom, _ := GetShiftStartTimeAndEndTime(time.Now(), constant.NULL)
	if aff.RowsAffected == constant.ZERO && currentFrom != start_time {
		var userAc dto.UserActivity
		userAc.UserAttendanceID = userAttendanceId
		userAc.StartTime = GetShiftStartTime(start_time)
		userAc.EndTime = start_time
		userAc.SpentTime = userAc.EndTime.Sub(userAc.StartTime)
		userAc.ActivityStatus = enum.Activity_OFFLINE
		userAc.WorkingStatus = enum.NON_WORKING_STATUS
		_, er := trx.SaveUserActivity(userAc)
		if er.RowsAffected == constant.ZERO {
			return dto.UserActivity{}, 0, er.Error
		}
		return userAc, aff.RowsAffected, nil

	} else if currentFrom != start_time {
		var userAc dto.UserActivity
		userAc.StartTime = userActivity.EndTime
		userAc.ActivityStatus = enum.Activity_OFFLINE
		userAc.UserAttendanceID = userAttendanceId
		userAc.WorkingStatus = enum.NON_WORKING_STATUS
		_, er := trx.SaveUserActivity(userAc)
		if er.RowsAffected == constant.ZERO {
			return dto.UserActivity{}, 0, er.Error
		}
	}
	userAct, aff := trx.GetUserActivityByUserAttendanceIDAndDate(userAttendanceId, constant.DATE_TIME)
	return userAct, aff.RowsAffected, nil
}

func SaveUserActivity(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	var listOfUserAct []dto.UserActivity
	if err := c.BindJSON(&listOfUserAct); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.FAILED_TO_READ_BODY})
		return
	}
	sort.SliceStable(listOfUserAct, func(i, j int) bool {
		return listOfUserAct[i].StartTime.Before(listOfUserAct[j].StartTime)
	})
	statusCode, message := SaveListOfUserActivity(listOfUserAct, userId)
	c.JSON(statusCode, message)
}

func UpdateUserActivity() {
	yesterdayFrom, yesterdayTo := GetShiftStartTimeAndEndTime(time.Now(), changeToPreviousDay(time.Now()).Format(constant.DATE))
	currentFrom, _ := GetShiftStartTimeAndEndTime(time.Now(), constant.NULL)
	zeroTime, _ := time.Parse(constant.DATE_TIME_FORMAT, constant.DATE_TIME)
	records, _ := repository.DB().UpdateUserActivity(yesterdayFrom, yesterdayTo)
	for _, userAc := range records {
		if userAc.EndTime == zeroTime && userAc.ActivityStatus != enum.Activity_IDLE {
			userAc.EndTime = yesterdayTo
			userAc.SpentTime = userAc.EndTime.Sub(userAc.StartTime)
			_, updateReport := repository.DB().SaveUserActivity(userAc)
			if updateReport.RowsAffected == constant.ZERO {
				log.Println(message.USER_ACTIVITY_CREATION_FAILED)
				return
			}
			var UserAct dto.UserActivity
			UserAct.StartTime = currentFrom
			UserAct.ActivityStatus = enum.UserActivityStatus(enum.WORKING_STATUS)
			userAttendance, _ := repository.DB().GetUserAttendance(userAc.UserAttendanceID)
			var listOfUserAct []dto.UserActivity
			listOfUserAct = append(listOfUserAct, UserAct)
			statusCode, message := SaveListOfUserActivity(listOfUserAct, userAttendance.UserID)
			log.Println(statusCode, ":", message)
		} else if userAc.ActivityStatus == enum.Activity_IDLE || userAc.ActivityStatus == enum.Activity_BREAK || userAc.ActivityStatus == enum.IDLE_BREAK {
			repository.DB().DeleteUserActivity(userAc, userAc.ID)
		}
	}
	log.Println(message.ACTIVITY_UPDATED)
}

func isBeforeSixOClock(startTime time.Time) bool {
	hour := startTime.Hour()
	return hour < 6
}

func changeToPreviousDay(startTime time.Time) time.Time {
	previousDay := startTime.AddDate(0, 0, -constant.ONE)
	return previousDay
}

func GetShiftStartTime(givenDate time.Time) time.Time {
	sixOClock := time.Date(givenDate.Year(), givenDate.Month(), givenDate.Day(), constant.SIX, constant.ZERO, constant.ZERO, constant.ZERO, givenDate.Location())
	return sixOClock
}

func SaveListOfUserActivity(listOfUserAct []dto.UserActivity, userId uint) (int, gin.H) {
	for _, userAc := range listOfUserAct {
		trx := repository.TX()
		getStartTime := userAc.StartTime
		if isBeforeSixOClock(userAc.StartTime) {
			getStartTime = changeToPreviousDay(getStartTime)
		}
		attendances, attendancesError := trx.GetLastUserAttendanceData(userId, getStartTime)
		if attendancesError.RowsAffected == constant.ZERO {
			attendances.UserID = userId
			attendances.StartTime = getStartTime
			trx.UpdateUserAttendance(attendances)

		}
		userAc.ActivityStatus = enum.UserActivityStatus(userAc.ActivityStatus)
		var userAct dto.UserActivity
		var rowsAffected int64
		userAttendance, data := trx.GetUserAttendanceDate(userId, attendances.StartTime)
		userAttendanceId := userAttendance.ID
		if data.RowsAffected == constant.ZERO {
			if userAc.ActivityStatus == enum.Activity_FINISH {
				return http.StatusInternalServerError, gin.H{message.ERROR: message.ACTIVITY_STATUS_SETTING_FAILED}

			}
			var userAt dto.UserAttendance
			userAt.StartTime = getStartTime
			userAt.UserID = userId
			userAttendance, er := trx.SaveUserAttendance(userAt)
			userAttendanceId = userAttendance.ID
			if er.RowsAffected == constant.ZERO {
				return http.StatusInternalServerError, gin.H{message.ERROR: message.USER_ATTENDANCE_CREATION_FAILED}
			}
		}
		userAc.UserAttendanceID = userAttendanceId
		userAf, aff := trx.GetUserActivityByUserAttendanceIDAndDate(userAttendanceId, constant.DATE_TIME)
		rowsAffected = aff.RowsAffected
		userAct = userAf
		if rowsAffected == constant.ZERO {
			userAff, af, e := userActivityMaxDate(userAttendanceId, trx, getStartTime)
			if e != nil {
				return http.StatusNoContent, gin.H{message.ERROR: e.Error()}
			}
			userAct = userAff
			rowsAffected = af
		}
		if rowsAffected != constant.ZERO {
			userAct.EndTime = userAc.StartTime
			userAct.SpentTime = userAct.EndTime.Sub(userAct.StartTime)
			if userAc.ActivityStatus == enum.Activity_WORKING {
				if userAct.ActivityStatus == enum.Activity_IDLE {
					if userAc.Reason != constant.NULL {
						userAct.Reason = userAc.Reason
						userAct.WorkingStatus = enum.WORKING_STATUS
					} else if userAc.Reason == constant.NULL {
						userAct.Reason = constant.IDLE_BREAK_MESSAGE
						userAct.ActivityStatus = enum.IDLE_BREAK
						userAct.WorkingStatus = enum.NON_WORKING_STATUS
					}
				}
			}
			_, er := trx.SaveUserActivity(userAct)
			if er.RowsAffected == constant.ZERO {
				return http.StatusInternalServerError, gin.H{message.ERROR: message.USER_ATTENDANCE_CREATION_FAILED}
			}
			if userAc.ActivityStatus == enum.Activity_FINISH {
				trx.Instance.Commit()
				continue
			}
		}
		userAcr := setWorkingStatus(userAc)
		_, saveReport := trx.SaveUserActivity(userAcr)
		if saveReport.RowsAffected == constant.ZERO {
			return http.StatusInternalServerError, gin.H{
				message.ERROR: message.USER_ACTIVITY_CREATION_FAILED,
			}
		}
		trx.Instance.Commit()
	}
	return http.StatusCreated, gin.H{message.MESSAGE: message.ACTIVITY_RECORED}
}
