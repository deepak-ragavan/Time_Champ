package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/tracker/pkg/service"
)

func LoadUserActivityController(r *gin.RouterGroup) {
	r.POST("/validate", service.Validate)
	r.GET("/user-activity/:id", service.GetUserActivity)
	r.POST("/user-activity", service.SaveUserActivity)
}
