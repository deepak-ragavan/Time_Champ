package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/service"
)

func LoadUserActivityController(r *gin.Engine) {
	r.GET("/user-activity/:id", middleware.RequireAuth, service.GetUserActivity)
	r.POST("/user-activity", middleware.RequireAuth, service.SaveUserActivity)
}
