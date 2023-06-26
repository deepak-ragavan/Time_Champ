package service

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/enum"
	"github.com/tracker/pkg/models"
	"github.com/tracker/pkg/repository"
)

func GetUserActivity(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == 0 {
		return
	}
	id, er := strconv.Atoi(c.Param("id"))
	if er != nil {
		c.JSON(http.StatusBadRequest, "Unable to convert pathvariable to int")
		return
	}
	userActivity, er := repository.GetUserActivity(id)
	if er != nil {
		c.JSON(http.StatusBadRequest, er)
		return
	}
	c.JSON(http.StatusOK, userActivity)
}

func SaveUserActivity(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == 0 {
		return
	}
	var userAc models.UserActivity
	if c.Bind(&userAc) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to read body",
		})
		return
	}
	if time.Now().Format(enum.DATE) != userAc.StartTime.Format(enum.DATE) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid date and time",
		})
		return
	}
	status := c.Query("activityStatus")
	userAc.ActivityStatus = enum.UserActivityStatus(status)
	var userAttendanceId int
	var userAct models.UserActivity
	var rowsAffected int64
	userAttendance, data := repository.GetUserCurrentDtae(userId)
	userAttendanceId = userAttendance.ID
	if data.RowsAffected == 0 {
		if userAc.ActivityStatus == enum.Activity_FINISH {
			c.JSON(http.StatusBadRequest, gin.H{"error": "failed to set activityStatus"})
			return
		}
		var userAt models.UserAttendance
		userAt.StartTime = userAc.StartTime
		userAt.UserID = userId
		userAttendance, er := repository.SaveUserAttendance(userAt)
		userAttendanceId = userAttendance.ID
		if er.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "failed to create UserAttendance"})
			return
		}
	}
	userAc.UserAttendanceID = userAttendanceId
	userAf, aff := repository.GetUserActivityByUserAttendanceIDAndDate(userAttendanceId, enum.DATE_TIME)
	rowsAffected = aff.RowsAffected
	userAct = userAf
	if rowsAffected == 0 {
		userAff, af, e := userActivityMaxDate(userAttendanceId)
		if e != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": e.Error(),
			})
			return
		}
		userAct = userAff
		rowsAffected = af
	}
	if rowsAffected != 0 {
		userAct.EndTime = userAc.StartTime
		userAct.SpentTime = userAct.EndTime.Sub(userAct.StartTime)
		if userAc.ActivityStatus == enum.Activity_WORKING {
			if userAct.ActivityStatus == enum.Activity_IDLE {
				if userAc.Reason != enum.NULL {
					userAct.Reason = userAc.Reason
					userAct.WorkingStatus = enum.WORKING_STATUS
				} else {
					userAct.ActivityStatus = enum.Activity_BREAK
					userAct.WorkingStatus = enum.NON_WORKING_STATUS
				}
			}
		}
		user, er := repository.SaveUserActivity(userAct)
		if er.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "failed to create UserAttendance",
			})
			return
		}
		if userAc.ActivityStatus == enum.Activity_FINISH {
			c.JSON(http.StatusCreated, user)
			return
		}
	}
	userAc = setWorkingStatus(userAc)
	userActive, da := repository.SaveUserActivity(userAc)
	if da.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to create UserActivity",
		})
		return
	}
	c.JSON(http.StatusCreated, userActive)
}

func setWorkingStatus(userAc models.UserActivity) models.UserActivity {
	userAc.Reason = enum.NULL
	if userAc.ActivityStatus == enum.Activity_WORKING {
		userAc.WorkingStatus = enum.WORKING_STATUS
	} else if userAc.ActivityStatus == enum.Activity_OFFLINE {
		userAc.WorkingStatus = enum.NON_WORKING_STATUS
	} else if userAc.ActivityStatus == enum.Activity_BREAK {
		userAc.WorkingStatus = enum.NON_WORKING_STATUS
	}
	return userAc
}

func userActivityMaxDate(userAttendanceId int) (models.UserActivity, int64, error) {
	userActivity, aff := repository.GetUserActivityByMaxDate(userAttendanceId)
	if aff.RowsAffected == 0 {
		return models.UserActivity{}, aff.RowsAffected, nil
	}
	var userAc models.UserActivity
	userAc.StartTime = userActivity.EndTime
	userAc.ActivityStatus = enum.Activity_BREAK
	userAc.UserAttendanceID = userAttendanceId
	userAc.WorkingStatus = enum.NON_WORKING_STATUS
	_, er := repository.SaveUserActivity(userAc)
	if er.RowsAffected == 0 {
		return models.UserActivity{}, 0, er.Error
	}
	userAct, aff := repository.GetUserActivityByUserAttendanceIDAndDate(userAttendanceId, enum.DATE_TIME)
	return userAct, aff.RowsAffected, nil
}
