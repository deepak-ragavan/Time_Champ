package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/tracker/pkg/enum"
	"github.com/tracker/pkg/models"
	"golang.org/x/exp/slices"
)

func Authorization(role enum.Role) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := c.Get("user")
		if !err {
			return
		}
		userRole := user.(models.User).Role
		if slices.Index(enum.Permission, string(role)) >= slices.Index(enum.Permission, string(userRole)) {
			c.Set("permission", true)
		}
		c.Next()
	}
}
