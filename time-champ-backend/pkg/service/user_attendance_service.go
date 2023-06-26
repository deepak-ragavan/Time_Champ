package service

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/enum"
	"github.com/tracker/pkg/repository"
)

func UpdateUserAttendance(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == 0 {
		return
	}
	userAttendance, er := repository.GetUserCurrentDtae(userId)
	fmt.Println(userAttendance)
	if er.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No Value Present",
		})
		return
	}
	totalBreak, _ := repository.GetTotalSpentTimeForBreakByUserAttendanceID(1, string(enum.Activity_BREAK))
	idle, _ := repository.GetTotalSpentTimeForBreakByUserAttendanceID(1, string(enum.Activity_IDLE))
	working, _ := repository.GetTotalSpentTimeForBreakByUserAttendanceID(1, string(enum.Activity_WORKING))
	userAttendance.TotalTime = time.Duration(idle) + time.Duration(working)
	userAttendance.BreakTime = time.Duration(totalBreak)
	userAttendance.Idle = time.Duration(idle)
	userAttendance.Working = time.Duration(working)
	fmt.Println(userAttendance)
	userAtt, data := repository.UpdateUserAttendance(userAttendance, userId)
	if data.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to create UserAttendance",
		})
		return
	}
	c.JSON(http.StatusOK, userAtt)

}
func GetUserAttendance(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == 0 {
		return
	}
	var body dto.DateDto
	if c.BindJSON(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid date and time",
		})
		return
	}
	userAttendances, r := repository.GetUserAttendanceByDate(userId, body.Date)
	if r.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": r.Error,
		})
	}
	c.JSON(http.StatusOK, userAttendances)
}

func GetAllUserAttendanceByID(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == 0 {
		return
	}
	userAttendanceList, er := repository.GetUserAllAttendancesByID(userId)
	if er.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No Value Present",
		})
		return
	}
	c.JSON(http.StatusOK, userAttendanceList)
}
