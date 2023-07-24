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
	affect := initializers.DB.First(&user, "access_uuid = ?", authD.AccessUuid)
	if affect.RowsAffected == constant.ZERO {
		return models.User{}, errors.New(message.UNAUTHORIZED)
	}

	if authD.UserId != int64(user.ID) {
		return models.User{}, errors.New(message.UNAUTHORIZED)
	}
	return user, nil
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
	id := user.(models.User).ID
	return id, nil
}
