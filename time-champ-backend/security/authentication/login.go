package authentication

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tracker/initializers"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/constant/message"
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/models"
	"golang.org/x/crypto/bcrypt"
)

func Login(c *gin.Context) {
	// get the email and pass off req body
	var body models.User
	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.FAILED_TO_READ_BODY})
		return
	}

	//look up requested user
	var user models.User
	initializers.DB.First(&user, "email = ?", body.Email)
	if user.ID == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.INVALID_EMAIL_OR_PASSWORD})
		return
	}
	//compare sent in pass with saved user pass hash
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.INVALID_EMAIL_OR_PASSWORD})
		return
	}
	tokens, err := GenerateToken(user)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{message.ERROR: err.Error()})
		return
	}
	//sent it back
	c.JSON(http.StatusOK, tokens)
}

func CreateAuth(userid int64, td *dto.TokenDetails) error {
	var user models.User
	affect := initializers.DB.First(&user, int(userid))
	if affect.RowsAffected == constant.ZERO {
		return errors.New(message.USER_NOT_FOUND)
	}
	user.AccessUuid = td.AccessUuid
	user.RefreshUuid = td.RefreshUuid
	errAccess := initializers.DB.Save(&user)
	if errAccess.RowsAffected == constant.ZERO {
		return errors.New(message.ACCESS_UUID_NOT_FOUND)
	}
	return nil
}

func GenerateToken(user models.User) (map[string]any, error) {
	ts, err := CreateToken(user)
	if err != nil {
		return nil, errors.New(message.UNPROCESSABLE_ENTITY)
	}

	saveErr := CreateAuth(int64(user.ID), ts)
	if saveErr != nil {
		return nil, errors.New(message.UNPROCESSABLE_ENTITY)
	}
	//sent it back
	tokens := map[string]any{
		"access_token":             ts.AccessToken,
		"access_token_Expires_in":  int((ts.AtExpires)),
		"refresh_token":            ts.RefreshToken,
		"refresh_token_Expires_in": int(ts.RtExpires),
		"id":                       user.ID,
	}
	return tokens, nil
}
