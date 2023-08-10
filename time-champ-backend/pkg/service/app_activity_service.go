package service

import (
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/constant/message"
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/enum"
	"github.com/tracker/pkg/repository"
)

func GetAppActivity(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, er := strconv.Atoi(c.Param("id"))
	if er != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.PATHVARIABLE_CONVERSION_TO_INT_FAILED})
		return
	}
	appActivity, af := repository.DB().GetAppActivity(uint(id))
	if af.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: af.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, appActivity)
}

func SaveAppActivities(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	var appActivities []dto.AppActivity
	if err := c.BindJSON(&appActivities); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.FAILED_TO_READ_BODY})
		return
	}
	if len(appActivities) == constant.ZERO {
		c.JSON(http.StatusNoContent, gin.H{message.ERROR: message.EMPTY_BODY})
		return
	}
	tx := repository.TX()
	var Date = time.Now()
	if isBeforeSixOClock(Date) {
		Date = changeToPreviousDay(Date)
	}
	startTime, endTime := GetShiftStartTimeAndEndTime(Date, constant.NULL)
	lastAppActivity, erro := repository.DB().GetLastAppActivityData(appActivities[constant.ZERO].User.ID, startTime, endTime)
	if erro.RowsAffected != constant.ZERO {
		appActivities = append(appActivities, lastAppActivity)
	}
	sort.SliceStable(appActivities, func(i, j int) bool {
		return appActivities[i].StartTime.Before(appActivities[j].StartTime)
	})
	var listSave []dto.AppActivity
	for currentIndex, appActivity := range appActivities {
		nextIndex := currentIndex + constant.ONE
		if nextIndex < len(appActivities) {
			appActivity.EndTime = appActivities[nextIndex].StartTime
			appActivity.SpentTime = appActivities[nextIndex].StartTime.Sub(appActivity.StartTime)
		}
		listSave = append(listSave, appActivity)
	}
	appAct, _ := tx.SaveAppActivity(listSave)

	tx.Instance.Commit()
	c.JSON(http.StatusCreated, appAct)
}

func GetAppActivityByUserId(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, er := strconv.Atoi(c.Query("userId"))
	if er != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.QUERY_PARAM_CONVERSION_TO_INT_FAILED})
		return
	}
	appActivity, af := repository.DB().GetAppActivityByUserId(uint(id))
	if af.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.RECORD_NOT_FOUND})
		return
	}
	c.JSON(http.StatusOK, appActivity)
}

func DeleteAppActivity(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, er := strconv.Atoi(c.Param("id"))
	if er != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.PATHVARIABLE_CONVERSION_TO_INT_FAILED})
		return
	}
	af := repository.DB().DeleteAppActivity(uint(id))
	if af.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.RECORD_NOT_FOUND})
		return
	}
	c.JSON(http.StatusBadRequest, gin.H{message.MESSAGE: message.APPACTIVITY_DELETED})
}

func GetTotalAppSpendTime(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, er := strconv.Atoi(c.Query("userId"))
	if er != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.INVALID_QUERY_PARAMETERS})
		return
	}
	appSpendTime, appSpendTimeError := repository.DB().GetTotalAppSpendTime(uint(id))
	if appSpendTimeError != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: appSpendTimeError.Error()})
		return
	}
	c.JSON(http.StatusOK, appSpendTime)
}

func GetSpendTimeByApp(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	app := c.Query("appName")
	id, er := strconv.Atoi(c.Query("userId"))
	if er != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.INVALID_QUERY_PARAMETERS})
		return
	}
	appSpendTime, appSpendTimeError := repository.DB().GetSpendTimeByAppName(uint(id), app)
	if appSpendTimeError != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: appSpendTimeError.Error()})
		return
	}
	c.JSON(http.StatusOK, appSpendTime)
}

func GetAppActivityByActivityStatus(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	start, _ := GetShiftStartTimeAndEndTime(time.Now(), c.Query("fromDate"))
	_, end := GetShiftStartTimeAndEndTime(time.Now(), c.Query("toDate"))
	var appActivityStatus dto.AppActivityStatus
	appActivityStatus.Productive = getAppActivityStatus(c, enum.PRODUCTIVE, start, end)
	appActivityStatus.Unproductive = getAppActivityStatus(c, enum.UNPRODUCTIVE, start, end)
	appActivityStatus.Neutral = getAppActivityStatus(c, enum.NEUTRAL, start, end)
	c.Set("limit", constant.FIVE)
	appActivityStatus.TopFiveApp = getAppActivityStatus(c, enum.PRODUCTIVE, start, end)
	c.JSON(http.StatusOK, appActivityStatus)
}

func getAppActivityStatus(c *gin.Context, status enum.AppActivityStatus, fromDate time.Time, toDate time.Time) []dto.AppActivitySpendTimeDto {
	limit, err := c.Get("limit")
	if !err {
		limit = constant.ZERO
	}
	appActivity, _ := repository.DB().GetAppActivityByActivityStatus(strings.Split(c.Query("userIds"), constant.COMMA), strings.Split(c.Query("branches"), constant.COMMA), strings.Split(c.Query("roles"), constant.COMMA), strings.Split(c.Query("departments"), constant.COMMA), string(status), fromDate.String(), toDate.String(), c.Query("searchText"), limit.(int))
	return appActivity
}

func GetTotalAppActivity(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	start, _ := GetShiftStartTimeAndEndTime(time.Now(), c.Query("fromDate"))
	_, end := GetShiftStartTimeAndEndTime(time.Now(), c.Query("toDate"))
	appActivity, er := repository.DB().GetTotalAppActivityStatus(strings.Split(c.Query("userIds"), constant.COMMA), strings.Split(c.Query("branches"), constant.COMMA), strings.Split(c.Query("roles"), constant.COMMA), strings.Split(c.Query("departments"), constant.COMMA), start.String(), end.String())
	if er.RowsAffected <= constant.ZERO {
		c.JSON(http.StatusNoContent, gin.H{message.ERROR: message.RECORD_NOT_FOUND})
		return
	}
	var activity dto.TotalAppActivity
	for _, entry := range appActivity {
		activity.DeskTime += time.Duration(entry.Counts)
		if entry.Status == string(enum.PRODUCTIVE) {
			activity.Productive = time.Duration(entry.Counts)
		} else if entry.Status == string(enum.UNPRODUCTIVE) {
			activity.Unproductive = time.Duration(entry.Counts)
		} else if entry.Status == string(enum.NEUTRAL) {
			activity.Neutral = time.Duration(entry.Counts)
		}
	}
	c.JSON(http.StatusOK, activity)
}

func GetShiftStartTimeAndEndTime(data time.Time, date string) (time.Time, time.Time) {
	var dateTime = data
	if date != constant.NULL {
		dateTime, _ = time.Parse(constant.DATE, date)
	}
	nextDay := dateTime.AddDate(0, 0, 1) // Add one day
	endTime := time.Date(nextDay.Year(), nextDay.Month(), nextDay.Day(), 5, 59, 59, 0, data.Location())
	startTime := time.Date(dateTime.Year(), dateTime.Month(), dateTime.Day(), 6, 0, 0, 0, data.Location())
	return startTime, endTime
}

// func GetTopFiveApplication(c *gin.Context) {
// 	userId, err := middleware.GetUserObject(c)
// 	if err != nil || userId == constant.ZERO {
// 		return
// 	}
// 	id, er := strconv.Atoi(c.Query("userId"))
// 	if er != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.INVALID_QUERY_PARAMETERS})
// 		return
// 	}
// 	start, end := GetShiftStartTimeAndEndTime(time.Now(), c.Query("dateate"))
// }
