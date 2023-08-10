package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/tracker/pkg/service"
)

func LoadScreenshotDetailsController(r *gin.RouterGroup) {
	r.GET("/screenshot-Details/getScreenshot", service.GetScreenshot)
}
