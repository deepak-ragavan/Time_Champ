package service

import (
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
	tx := repository.TX()
	getDate := time.Now().Format(constant.DATE)
	lastAppActivity, erro := repository.DB().GetLastAppActivityData(appActivities[0].User.ID, getDate)
	if erro.RowsAffected != constant.ZERO {
		appActivities = append(appActivities, lastAppActivity)
	}
	sort.SliceStable(appActivities, func(i, j int) bool {
		return appActivities[i].StartTime.Before(appActivities[j].StartTime)
	})
	var listSave []dto.AppActivity
	for currentIndex, appActivity := range appActivities {
		nextIndex := currentIndex + 1
		if nextIndex < len(appActivities) {
			appActivity.EndTime = appActivities[nextIndex].StartTime
			appActivity.SpentTime = appActivities[nextIndex].StartTime.Sub(appActivity.StartTime)
		}
		listSave = append(listSave, appActivity)
	}
	tx.SaveAppActivity(listSave)
	tx.Instance.Commit()
	c.JSON(http.StatusCreated, listSave)
}

func GetAppActivityByUserId(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, er := strconv.Atoi(c.Query("userId"))
	if er != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.PATHVARIABLE_CONVERSION_TO_INT_FAILED})
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
	var appActivityStatus dto.AppActivityStatus
	appActivityStatus.Productive = getAppActivityStatus(c, enum.PRODUCTIVE)
	appActivityStatus.Unproductive = getAppActivityStatus(c, enum.UNPRODUCTIVE)
	appActivityStatus.Neutral = getAppActivityStatus(c, enum.NEUTRAL)
	c.Set("limit", constant.FIVE)
	appActivityStatus.TopFiveApp = getAppActivityStatus(c, enum.PRODUCTIVE)
	c.JSON(http.StatusOK, appActivityStatus)
}

func getAppActivityStatus(c *gin.Context, status enum.AppActivityStatus) []dto.AppActivitySpendTimeDto {
	id, _ := strconv.Atoi(c.Query("userId"))
	limit, err := c.Get("limit")
	if !err {
		limit = constant.ZERO
	}
	appActivity, _ := repository.DB().GetAppActivityByActivityStatus(uint(id), string(status), c.Query("fromDate"), c.Query("toDate"), c.Query("searchText"), limit.(int))
	return appActivity
}

func GetTotalAppActivity(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, _ := strconv.Atoi(c.Query("userId"))
	appActivity, er := repository.DB().GetTotalAppActivity(uint(id), c.Query("fromDate"), c.Query("toDate"))
	if er.RowsAffected <= constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.RECORD_NOT_FOUND})
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
