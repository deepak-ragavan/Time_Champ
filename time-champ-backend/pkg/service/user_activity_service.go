package service

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/constant/message"
	"github.com/tracker/pkg/enum"
	"github.com/tracker/pkg/models"
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

func SaveUserActivity(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	trx := repository.TX()
	var userAc models.UserActivity
	if c.Bind(&userAc) != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.FAILED_TO_READ_BODY})
		return
	}
	if time.Now().Format(constant.DATE) != userAc.StartTime.Format(constant.DATE) {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.INVALID_DATE_TIME})
		return
	}
	status := c.Query("activityStatus")
	userAc.ActivityStatus = enum.UserActivityStatus(status)
	var userAttendanceId uint
	var userAct models.UserActivity
	var rowsAffected int64
	userAttendance, data := trx.GetUserCurrentDate(userId)
	userAttendanceId = userAttendance.ID
	if data.RowsAffected == constant.ZERO {
		if userAc.ActivityStatus == enum.Activity_FINISH {
			c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.ACTIVITY_STATUS_SETTING_FAILED})
			return
		}
		var userAt models.UserAttendance
		userAt.StartTime = userAc.StartTime
		userAt.UserID = userId
		userAttendance, er := trx.SaveUserAttendance(userAt)
		userAttendanceId = userAttendance.ID
		if er.RowsAffected == constant.ZERO {
			c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.USER_ATTENDANCE_CREATION_FAILED})
			return
		}
	}
	userAc.UserAttendanceID = userAttendanceId
	userAf, aff := trx.GetUserActivityByUserAttendanceIDAndDate(userAttendanceId, constant.DATE_TIME)
	rowsAffected = aff.RowsAffected
	userAct = userAf
	if rowsAffected == constant.ZERO {
		userAff, af, e := userActivityMaxDate(userAttendanceId, trx)
		if e != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				message.ERROR: e.Error(),
			})
			return
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
				} else {
					userAct.ActivityStatus = enum.Activity_BREAK
					userAct.WorkingStatus = enum.NON_WORKING_STATUS
				}
			}
		}
		user, er := trx.SaveUserActivity(userAct)
		if er.RowsAffected == constant.ZERO {
			c.JSON(http.StatusBadRequest, gin.H{
				message.ERROR: message.USER_ATTENDANCE_CREATION_FAILED,
			})
			return
		}
		if userAc.ActivityStatus == enum.Activity_FINISH {
			trx.Instance.Commit()
			c.JSON(http.StatusCreated, user)
			return
		}
	}
	userAc = setWorkingStatus(userAc)
	userActive, da := trx.SaveUserActivity(userAc)
	if da.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{
			message.ERROR: message.USER_ACTIVITY_CREATION_FAILED,
		})
		return
	}
	trx.Instance.Commit()
	c.JSON(http.StatusCreated, userActive)
}

func setWorkingStatus(userAc models.UserActivity) models.UserActivity {
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

func userActivityMaxDate(userAttendanceId uint, trx repository.DbInstance) (models.UserActivity, int64, error) {
	userActivity, aff := trx.GetUserActivityByMaxDate(userAttendanceId)
	if aff.RowsAffected == constant.ZERO {
		return models.UserActivity{}, aff.RowsAffected, nil
	}
	var userAc models.UserActivity
	userAc.StartTime = userActivity.EndTime
	userAc.ActivityStatus = enum.Activity_BREAK
	userAc.UserAttendanceID = userAttendanceId
	userAc.WorkingStatus = enum.NON_WORKING_STATUS
	_, er := trx.SaveUserActivity(userAc)
	if er.RowsAffected == constant.ZERO {
		return models.UserActivity{}, 0, er.Error
	}
	userAct, aff := trx.GetUserActivityByUserAttendanceIDAndDate(userAttendanceId, constant.DATE_TIME)
	return userAct, aff.RowsAffected, nil
}
