package service

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/constant/message"
	"github.com/tracker/pkg/repository"
)

func GetScreenshot(c *gin.Context) {
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
	screenshotDetails, aff := repository.DB().GetScreenshotDetailsByDate(uint(id), start, end)
	if aff.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.RECORD_NOT_FOUND})
		return
	}
	c.JSON(http.StatusOK, screenshotDetails)
}
