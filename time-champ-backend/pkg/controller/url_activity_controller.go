package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/tracker/pkg/service"
)

func LoadUrlActivityController(r *gin.RouterGroup) {
	r.GET("/url-activity/:id", service.GetUrlActivity)
	r.POST("/url-activity", service.SaveUrlActivity)
	r.GET("/url-activity", service.GetUrlActivityByUserId)
	r.DELETE("/url-activity/:id", service.DeleteUrlActivity)
}
