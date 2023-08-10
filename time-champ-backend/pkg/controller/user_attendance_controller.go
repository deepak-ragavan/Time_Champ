package controller

import (
	"github.com/gin-gonic/gin"
	csvgenerator "github.com/tracker/common/csv_generator"
	"github.com/tracker/pkg/service"
)

func LoadUserAttendanceController(r *gin.RouterGroup) {
	r.GET("/user-attendance", service.UpdateUserAttendance)
	r.GET("/user-attendance/getUserAttendanceDetails", service.GetUserAttendanceDetails)
	r.GET("/user-attendance/report", service.UserAttendanceReport)
	r.GET("/user-attendance/productivity", service.GetUserAttendanceProductivity)
	r.GET("/user-attendance/productivity-report", csvgenerator.ProductivityReport)

}
