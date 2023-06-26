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
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/enum"
	"github.com/tracker/pkg/models"
)

func Logout(c *gin.Context) {
	metadata, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	delErr := DeleteTokens(metadata)
	if delErr != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": delErr.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully logged out"})
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
	affect := initializers.DB.First(&user, int(authD.UserId), authD.AccessUuid)
	if user.AccessUuid != authD.AccessUuid {
		return errors.New(" Token expired")
	}
	if affect.RowsAffected == 0 {
		return errors.New("user not found")
	}
	user.AccessUuid = enum.NULL
	user.RefreshUuid = enum.NULL
	errAccess := initializers.DB.Save(&user)
	if errAccess.RowsAffected == 0 {
		return errors.New(" Unauthorized ")
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

func Validate(c *gin.Context) {
	user, err := c.Get("user")
	if !err {
		return
	}
	c.JSON(http.StatusOK, user)
}
