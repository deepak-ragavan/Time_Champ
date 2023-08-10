package service

import (
	"net/http"
	"sort"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/mitchellh/mapstructure"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/constant/message"
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/repository"
)

func SaveTrackerChartDetails(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	var trackerChartAndScreenshotDetailsList []dto.TrackerChartAndScreenshotDetails
	if err := c.BindJSON(&trackerChartAndScreenshotDetailsList); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.FAILED_TO_READ_BODY})
		return
	}
	id, er := strconv.Atoi(c.Query("userId"))
	if er != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.QUERY_PARAM_CONVERSION_TO_INT_FAILED})
		return
	}
	tx := repository.TX()
	var Date = time.Now()
	if isBeforeSixOClock(Date) {
		Date = changeToPreviousDay(Date)
	}
	startTime, endTime := GetShiftStartTimeAndEndTime(Date, constant.NULL)
	sort.SliceStable(trackerChartAndScreenshotDetailsList, func(i, j int) bool {
		return trackerChartAndScreenshotDetailsList[i].StartTime.Before(trackerChartAndScreenshotDetailsList[j].StartTime)
	})
	for _, trackerChartAndScreenshotDetails := range trackerChartAndScreenshotDetailsList {
		var trackerChartDetails dto.TrackerChartDetails
		trackerChart, aff := tx.GetLastTrackerChartDetails(uint(id), startTime, endTime)
		if aff.RowsAffected != constant.ZERO {
			trackerChart.EndTime = trackerChartAndScreenshotDetails.StartTime
			trackerChart.SpentTime = trackerChart.EndTime.Sub(trackerChart.StartTime)
			tx.SaveTrackerChartDetails(trackerChart)
		}
		mapstructure.Decode(trackerChartAndScreenshotDetails, &trackerChartDetails)
		trackerChartDetails.UserID = uint(id)
		trackerChartDetails.StartTime = trackerChartAndScreenshotDetails.StartTime
		tx.SaveTrackerChartDetails(trackerChartDetails)
		user, mess := repository.DB().GetUser(uint(id))
		if mess == nil {
			c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.USER_NOT_FOUND})
			return
		}
		var screenshotDetails dto.ScreenshotDetails
		for _, tracker := range trackerChartAndScreenshotDetails.Screenshots {
			mapstructure.Decode(tracker, &screenshotDetails)
			screenshotDetails.Name = user.Name
			screenshotDetails.StartTime = tracker.StartTime
			screenshotDetails.UserID = uint(id)
			tx.SaveScreenshotDetails(screenshotDetails)
		}
	}
	tx.Instance.Commit()
	c.JSON(http.StatusCreated, gin.H{})
}

func GetMouseAndKeyActvity(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, paramErr := strconv.Atoi(c.Query("userId"))
	if paramErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.QUERY_PARAM_CONVERSION_TO_INT_FAILED})
		return
	}
	date := c.Query("date")
	start, end := GetShiftStartTimeAndEndTime(time.Now(), date)
	trackerChartDetails, aff := repository.DB().GetTrackerChartDetailsReportByDate(uint(id), start, end)
	if aff.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.RECORD_NOT_FOUND})
		return
	}
	c.JSON(http.StatusOK, trackerChartDetails)
}
