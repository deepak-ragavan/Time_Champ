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
		accessUuid, okk := claims["access_uuid"].(string)
		desktopUuid, ok := claims["desktop_uuid"].(string)
		if !ok && !okk {
			return nil, err
		}
		userId, err := strconv.ParseUint(fmt.Sprintf("%.f", claims["user_id"]), 10, 64)
		if err != nil {
			return nil, err
		}
		return &dto.AccessDetails{
			AccessUuid:  accessUuid,
			DesktopUuid: desktopUuid,
			UserId:      int64(userId),
		}, nil
	}
	return nil, err
}

func DeleteTokens(authD *dto.AccessDetails) error {
	var user models.User
	var desktopUser models.User
	affect := initializers.DB.Where("id = ? And access_uuid = ?", authD.UserId, authD.AccessUuid).First(&user)
	aff := initializers.DB.Where("id = ? And desktop_uuid = ?", authD.UserId, authD.DesktopUuid).First(&desktopUser)
	if user.AccessUuid != authD.AccessUuid && desktopUser.DesktopUuid != authD.DesktopUuid {
		return errors.New(" Token expired")
	}
	if affect.RowsAffected != constant.ZERO && authD.AccessUuid != constant.NULL {
		user.AccessUuid = constant.NULL
		user.RefreshUuid = constant.NULL
		errAccess := initializers.DB.Save(&user)
		if errAccess.RowsAffected == constant.ZERO {
			return errors.New(message.UNAUTHORIZED)
		}
		return nil
	} else if aff.RowsAffected != constant.ZERO && authD.DesktopUuid != constant.NULL {
		desktopUser.DesktopUuid = constant.NULL
		err := initializers.DB.Save(&desktopUser)
		if err.RowsAffected == constant.ZERO {
			return errors.New(message.UNAUTHORIZED)
		}
		return nil
	}
	return errors.New(" Token expired")
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
	return constant.NULL
}
