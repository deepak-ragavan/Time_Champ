package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/enum"
	"github.com/tracker/pkg/service"
)

func LoadAdminController(admin *gin.RouterGroup) {
	admin.Use(middleware.RequireAuth, middleware.Authorization(enum.ADMIN))
	admin.POST("/validate", service.Validate)
}
