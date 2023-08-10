package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/tracker/pkg/service"
)

func LoadTrackerChartDetailsController(r *gin.RouterGroup) {
	r.POST("/tracker-chartdetails/screenshot-Details/saveTrackerChartAndScreenshots", service.SaveTrackerChartDetails)
	r.GET("/tracker-chartdetails/getMouseAndKeyActvity", service.GetMouseAndKeyActvity)
}
