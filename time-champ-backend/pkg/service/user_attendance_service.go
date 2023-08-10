package service

import (
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/mitchellh/mapstructure"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/constant/message"
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/enum"
	"github.com/tracker/pkg/repository"
)

func UpdateUserAttendance(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, paramErr := strconv.Atoi(c.Query("userId"))
	if paramErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.QUERY_PARAM_CONVERSION_TO_INT_FAILED})
		return
	}
	userAttendance, er := repository.DB().GetUserCurrentDate(uint(id))
	if er.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.NO_VALUE_PRESENT})
		return
	}
	data, err := repository.DB().GetUserActivitySummary(uint(id))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: err.Error()})
		return
	}
	for _, entry := range data {
		if entry.Status == string(enum.Activity_BREAK) {
			userAttendance.BreakTime = time.Duration(entry.Counts)
		} else if entry.Status == string(enum.Activity_IDLE) {
			userAttendance.Idle = time.Duration(entry.Counts)
		} else if entry.Status == string(enum.Activity_WORKING) {
			userAttendance.Working = time.Duration(entry.Counts)
		}
	}
	start, end := GetShiftStartTimeAndEndTime(time.Now(), constant.NULL)
	appActivity, er := repository.DB().GetTotalAppActivity(uint(id), start.String(), end.String())
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
	userAttendance.TotalTime = userAttendance.Idle + userAttendance.Working
	userAttendance.Productive = activity.Productive
	userAttendance.Neutral = activity.Neutral
	userAttendance.Unproductive = activity.Unproductive
	userAttendance.DeskTime = activity.DeskTime
	userAtt, af := repository.DB().UpdateUserAttendance(userAttendance)
	if af.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{
			message.ERROR: message.USER_ATTENDANCE_UPDATE_FAILED,
		})
		return
	}
	c.JSON(http.StatusOK, userAtt)
}

func UserAttendanceReport(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, paramErr := strconv.Atoi(c.Query("userId"))
	if paramErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.QUERY_PARAM_CONVERSION_TO_INT_FAILED})
		return
	}
	fromDate := c.Query("fromDate")
	toDate := c.Query("toDate")
	childsId, _ := GetChildUserIds(uint(id))
	userAttendanceList, er := repository.TX().GetUserAttendanceReport(childsId, fromDate, toDate)
	if er.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.RECORD_NOT_FOUND})
		return
	}
	c.JSON(http.StatusOK, userAttendanceList)
}

func GetUserAttendanceProductivity(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	var data []dto.Data
	id, paramErr := strconv.Atoi(c.Query("userId"))
	if paramErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.QUERY_PARAM_CONVERSION_TO_INT_FAILED})
		return
	}
	weekDates := strings.Split(c.Query("weekDates"), constant.COMMA)
	users, aff := GetUserData(uint(id))
	if aff != constant.NULL {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.RECORD_NOT_FOUND})
		return
	}

	for _, user := range users {
		data = append(data, SetUserAttendanceProductivity(user, weekDates))
	}
	if data == nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.RECORD_NOT_FOUND})
		return
	}
	c.JSON(http.StatusOK, data)
}

func SetUserAttendanceProductivity(user dto.Users, weekDates []string) dto.Data {
	var data dto.Data
	mapstructure.Decode(user, &data)
	userAttendance, _ := repository.DB().GetUserAttendanceProductivity(user.ID, weekDates)
	for _, userAtt := range userAttendance {
		weekDates = removeString(weekDates, userAtt.StartTime.Format(constant.DATE))
		var productive dto.Productivity
		mapstructure.Decode(userAtt, &productive)
		productive.StartTime = userAtt.StartTime
		productive.EndTime = userAtt.EndTime
		data.Productivity = append(data.Productivity, productive)
	}
	for _, Date := range weekDates {
		var prod dto.Productivity
		date, _ := time.Parse(constant.DATE, Date)
		prod.StartTime = date
		prod.EndTime = date
		data.Productivity = append(data.Productivity, prod)
	}
	sort.SliceStable(data.Productivity, func(i, j int) bool {
		return data.Productivity[i].StartTime.Before(data.Productivity[j].StartTime)
	})
	return data
}

func GetUserAttendanceDetails(c *gin.Context) {
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
	userAttendance, aff := repository.DB().GetUserAttendanceByDate(uint(id), date)
	if aff.RowsAffected == constant.ZERO {
		c.JSON(http.StatusNotFound, gin.H{message.ERROR: message.RECORD_NOT_FOUND})
		return
	}
	c.JSON(http.StatusOK, userAttendance)
}

func removeString(slice []string, target string) []string {
	result := []string{}
	for _, s := range slice {
		if s != target {
			result = append(result, s)
		}
	}
	return result
}

