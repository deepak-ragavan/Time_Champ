package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/tracker/pkg/service"
)

func LoadSystemImageController(r *gin.RouterGroup) {
	r.POST("/system-image/upload", service.UploadImage)
	r.GET("/system-image/get-all", service.GetImages)
	r.GET("/system-image/get-by-date", service.GetImagesByDate)
	r.DELETE("/system-image/delete-by-month", service.DeleteLastMonthScreenshots)
}
