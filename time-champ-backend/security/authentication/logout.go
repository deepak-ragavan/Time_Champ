package authentication

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/tracker/initializers"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/constant/message"
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/models"
)

func Logout(c *gin.Context) {
	metadata, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{message.ERROR: message.UNAUTHORIZED})
		return
	}
	delErr := DeleteTokens(metadata)
	if delErr != nil {
		c.JSON(http.StatusUnauthorized, gin.H{message.ERROR: delErr.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{message.MESSAGE: message.SUCCESSFUL_LOGOUT_MESSAGE})
}

func ExtractTokenMetadata(r *http.Request) (*dto.AccessDetails, error) {
	token, err := VerifyToken(r)
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		accessUuid, ok := claims["access_uuid"].(string)
		if !ok {
			return nil, err
		}
		userId, err := strconv.ParseUint(fmt.Sprintf("%.f", claims["user_id"]), 10, 64)
		if err != nil {
			return nil, err
		}
		return &dto.AccessDetails{
			AccessUuid: accessUuid,
			UserId:     int64(userId),
		}, nil
	}
	return nil, err
}

func DeleteTokens(authD *dto.AccessDetails) error {
	//get the refresh uuid
	var user models.User
	affect := initializers.DB.First(&user, uint(authD.UserId), authD.AccessUuid)
	if user.AccessUuid != authD.AccessUuid {
		return errors.New(" Token expired")
	}
	if affect.RowsAffected == constant.ZERO {
		return errors.New(message.USER_NOT_FOUND)
	}
	user.AccessUuid = constant.NULL
	user.RefreshUuid = constant.NULL
	errAccess := initializers.DB.Save(&user)
	if errAccess.RowsAffected == constant.ZERO {
		return errors.New(message.UNAUTHORIZED)
	}
	return nil
}

func VerifyToken(r *http.Request) (*jwt.Token, error) {
	tokenString := ExtractToken(r)
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("ACCESS_SECRET")), nil
	})
	if err != nil {
		return nil, err
	}
	return token, nil
}

func ExtractToken(r *http.Request) string {
	bearToken := r.Header.Get("Authorization")
	strArr := strings.Split(bearToken, " ")
	if len(strArr) == 2 {
		return strArr[1]
	}
	return ""
}
