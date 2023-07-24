package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/enum"
	"github.com/tracker/pkg/service"
)

func LoadSuperAdminController(superAdmin *gin.RouterGroup) {
	superAdmin.Use(middleware.RequireAuth, middleware.Authorization(enum.SUPER_ADMIN))
	superAdmin.POST("/validate", service.Validate)
}
