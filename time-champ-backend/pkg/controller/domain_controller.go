package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/enum"
	"github.com/tracker/pkg/service"
)

func LoadDomainController(domain *gin.RouterGroup) {
	domain.Use(middleware.RequireAuth, middleware.Authorization(enum.USER))
	domain.POST("/domain", service.CreateDomain)
}
