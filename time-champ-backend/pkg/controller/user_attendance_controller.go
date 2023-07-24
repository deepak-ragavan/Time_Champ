package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/tracker/pkg/service"
	csvgenerator "github.com/tracker/utils/csvGenerator"
)

func LoadUserAttendanceController(r *gin.RouterGroup) {
	r.GET("/user-attendance", service.UpdateUserAttendance)
	r.GET("/user-attendance/all-date", service.GetUserAttendanceByUserID)
	r.GET("/user-attendance/report", service.GetUserAttendanceByMonthly)
	r.GET("/user-attendance/productivity", service.GetUserAttendanceProductivity)
	r.GET("/user-attendance/productivity-report", csvgenerator.ProductivityReport)

}
