package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/enum"
	"github.com/tracker/pkg/service"
)

func LoadManagerController(manager *gin.RouterGroup) {
	manager.Use(middleware.RequireAuth, middleware.Authorization(enum.MANAGER))
	manager.POST("/validate", service.Validate)

}
