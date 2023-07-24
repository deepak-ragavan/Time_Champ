package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/enum"
	"github.com/tracker/pkg/service"
)

func LoadTeamLeadController(teamLead *gin.RouterGroup) {
	teamLead.Use(middleware.RequireAuth, middleware.Authorization(enum.TEAM_LEAD))
	teamLead.POST("/validate", service.Validate)

}
