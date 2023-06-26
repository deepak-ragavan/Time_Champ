package middleware

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tracker/initializers"
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/models"
	"github.com/tracker/security/authentication"
)

func RequireAuth(c *gin.Context) {
	metadata, err := authentication.ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	user, err := FetchAuth(metadata)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	c.Set("user", user)
	//continue
	c.Next()
}

func FetchAuth(authD *dto.AccessDetails) (models.User, error) {
	var user models.User
	affect := initializers.DB.First(&user, "access_uuid = ?", authD.AccessUuid)
	if affect.RowsAffected == 0 {
		return models.User{}, errors.New("unauthorized")
	}

	if authD.UserId != int64(user.ID) {
		return models.User{}, errors.New("unauthorized")
	}
	return user, nil
}
func GetUserObject(c *gin.Context) (int, error) {
	user, err := c.Get("user")
	if !err {
		return 0, errors.New("unauthorized")
	}
	id := user.(models.User).ID

	return id, nil

}
