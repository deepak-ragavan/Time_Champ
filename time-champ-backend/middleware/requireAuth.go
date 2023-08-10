package middleware

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tracker/initializers"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/constant/message"
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/models"
	"github.com/tracker/security/authentication"
)

func RequireAuth(c *gin.Context) {
	metadata, err := authentication.ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{message.ERROR: message.UNAUTHORIZED})
		return
	}
	user, err := FetchAuth(metadata)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{message.ERROR: message.UNAUTHORIZED})
		return
	}
	c.Set("user", user)
	//continue
	c.Next()
}

func FetchAuth(authD *dto.AccessDetails) (models.User, error) {
	var user models.User
	var desktopUser models.User
	if authD.AccessUuid != constant.NULL {
		affect := initializers.DB.First(&user, "access_uuid = ?", authD.AccessUuid)
		if affect.RowsAffected != constant.ZERO && authD.UserId == int64(user.ID) {
			return user, nil
		}
	} else if authD.DesktopUuid != constant.NULL {
		aff := initializers.DB.First(&desktopUser, "desktop_uuid = ?", authD.DesktopUuid)
		if aff.RowsAffected != constant.ZERO && authD.UserId == int64(desktopUser.ID) {
			return desktopUser, nil
		}
	}
	return models.User{}, errors.New(" Token expired")
}

func GetUserObject(c *gin.Context) (uint, error) {
	user, er := c.Get("user")
	if !er {
		return 0, errors.New(message.UNAUTHORIZED)
	}
	_, err := c.Get("permission")
	if !err {
		c.JSON(http.StatusUnauthorized, gin.H{message.ERROR: message.UNAUTHORIZED_USER})
		return 0, errors.New(message.UNAUTHORIZED_USER)
	}
	if user.(models.User).IsDeleted {
		c.JSON(http.StatusUnauthorized, gin.H{message.ERROR: message.USER_DELEDED})
		return 0, errors.New(message.USER_DELEDED)
	}
	if user.(models.User).IsBlocked {
		c.JSON(http.StatusUnauthorized, gin.H{message.ERROR: message.USER_BLOCKED})
		return 0, errors.New(message.USER_BLOCKED)
	}
	id := user.(models.User).ID
	return id, nil
}
