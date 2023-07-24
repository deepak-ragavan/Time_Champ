package service

import (
	"encoding/json"
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
	"github.com/tracker/pkg/enum"
	"github.com/tracker/pkg/repository"
)

func UpdateUserAttendance(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, _ := strconv.Atoi(c.Query("userId"))
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
	appActivity, er := repository.DB().GetTotalAppActivity(uint(id), time.Now().Format(constant.DATE), time.Now().Format(constant.DATE))
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
func GetUserAttendanceByUserID(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, _ := strconv.Atoi(c.Query("userId"))
	userAttendanceList, er := repository.DB().GetUserAttendanceByUserID(uint(id))
	if er.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: er.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, userAttendanceList)
}
func GetUserAttendanceByMonthly(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, _ := strconv.Atoi(c.Query("userId"))
	fromDate := c.Query("fromDate")
	toDate := c.Query("toDate")
	userAttendanceList, er := repository.TX().GetUserAttendanceReport(uint(id), fromDate, toDate)
	if er.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: er.Error.Error()})
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
	var weekDates []string
	id, _ := strconv.Atoi(c.Query("userId"))
	arrOfDate := c.Query("weekDates")
	users, aff := GetUserData(uint(id))
	if aff != constant.NULL {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.RECORD_NOT_FOUND})
		return
	}
	_ = json.Unmarshal([]byte(arrOfDate), &weekDates)
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

func removeString(slice []string, target string) []string {
	result := []string{}
	for _, s := range slice {
		if s != target {
			result = append(result, s)
		}
	}
	return result
}
