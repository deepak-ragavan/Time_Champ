package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/service"
)

func LoadSystemImageController(r *gin.Engine) {
	r.POST("/system-image/upload", middleware.RequireAuth, service.UploadImage)
	r.GET("/system-image/getAll", middleware.RequireAuth, service.GetImages)
	r.GET("/system-image/getByDate", middleware.RequireAuth, service.GetImagesByDate)
	r.DELETE("/system-image/deleteByMonth", middleware.RequireAuth, service.DeleteLastMonthScreenshots)
}
