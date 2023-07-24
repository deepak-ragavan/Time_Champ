package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/tracker/pkg/service"
)

func LoadAppActivityController(r *gin.RouterGroup) {
	r.GET("/app-activity/:id", service.GetAppActivity)
	r.GET("/app-activity", service.GetAppActivityByUserId)
	r.DELETE("/app-activity/:id", service.DeleteAppActivity)
	r.POST("/app-activitys", service.SaveAppActivities)
	r.GET("/app-activity/total-spendtime", service.GetTotalAppSpendTime)
	r.GET("/app-activity/spendtime-by-app", service.GetSpendTimeByApp)
	r.GET("/app-activity/status", service.GetAppActivityByActivityStatus)
	r.GET("/app-activity/total-app-activity", service.GetTotalAppActivity)
}
