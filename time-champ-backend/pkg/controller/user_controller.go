package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/tracker/pkg/service"
)

func LoadUserController(r *gin.RouterGroup) {
	r.GET("/users", service.GetChildUser)
}
