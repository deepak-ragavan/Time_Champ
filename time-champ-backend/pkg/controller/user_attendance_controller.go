package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/service"
)

func LoadUserAttendanceController(r *gin.Engine) {
	r.GET("/user-attendance", middleware.RequireAuth, service.UpdateUserAttendance)
	r.GET("/user-attendance/date", middleware.RequireAuth, service.GetUserAttendance)
	r.GET("/user-attendance/allDate", middleware.RequireAuth, service.GetAllUserAttendanceByID)
}
