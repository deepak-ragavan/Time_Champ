package authentication

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/tracker/initializers"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/constant/message"
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/models"
	"github.com/tracker/pkg/repository"
	"github.com/twinj/uuid"
)

func CreateToken(user models.User) (*dto.TokenDetails, error) {
	userid := user.ID
	td := &dto.TokenDetails{}
	atTime := time.Second * constant.ACCESS_TOKEN_EXPIRY_TIME_SEC
	td.AtExpires = time.Now().Add(atTime).Unix()
	td.AccessUuid = uuid.NewV4().String()

	rtTime := time.Hour * constant.REFRESH_TOKEN_EXPIRY_TIME_HOURS
	td.RtExpires = time.Now().Add(rtTime).Unix()
	td.RefreshUuid = td.AccessUuid + "++" + strconv.Itoa(int(userid))

	var err error
	//Creating Access Token
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["access_uuid"] = td.AccessUuid
	atClaims["user_id"] = userid
	atClaims["exp"] = td.AtExpires
	atClaims["role"] = user.Role
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	td.AccessToken, err = at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
	if err != nil {
		return nil, err
	}
	//Creating Refresh Token
	rtClaims := jwt.MapClaims{}
	rtClaims["refresh_uuid"] = td.RefreshUuid
	rtClaims["user_id"] = userid
	rtClaims["exp"] = td.RtExpires
	rt := jwt.NewWithClaims(jwt.SigningMethodHS256, rtClaims)
	td.RefreshToken, err = rt.SignedString([]byte(os.Getenv("REFRESH_SECRET")))
	if err != nil {
		return nil, err
	}
	td.AtExpires = int64(atTime) / constant.COVERT_MILLISECONDS
	td.RtExpires = int64(rtTime) / constant.COVERT_MILLISECONDS
	return td, nil
}

func Refresh(c *gin.Context) {
	mapToken := map[string]string{}
	if err := c.ShouldBindJSON(&mapToken); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{message.ERROR: err.Error()})
		return
	}
	refreshToken := mapToken["refresh_token"]
	//verify the token
	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		//Make sure that the token method conform to "SigningMethodHMAC"
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("REFRESH_SECRET")), nil
	})
	//if there is an error, the token must have expired
	if err != nil {
		log.Println("the error: ", err)
		c.JSON(http.StatusUnauthorized, gin.H{message.ERROR: message.REFRESH_TOKEN_EXPIRED})
		return
	}

	//Since token is valid, get the uuid:
	claims, ok := token.Claims.(jwt.MapClaims) //the token claims should conform to MapClaims
	if ok && token.Valid {
		_, ok := claims["refresh_uuid"].(string) //convert the interface to string
		if !ok {
			c.JSON(http.StatusUnprocessableEntity, gin.H{message.ERROR: err.Error()})
			return
		}
		_, err := FetchRefresh(claims["refresh_uuid"].(string))
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{message.ERROR: message.REFRESH_TOKEN_EXPIRED})
			return
		}
		userId, err := strconv.ParseUint(fmt.Sprintf("%.f", claims["user_id"]), 10, 64)
		user, af := repository.DB().GetUser(uint(userId))
		if err != nil && af.RowsAffected == constant.ZERO {
			c.JSON(http.StatusUnprocessableEntity, gin.H{
				message.ERROR: "Error occurred",
			})
			return
		}
		ts, createErr := CreateToken(user)
		if createErr != nil {
			c.JSON(http.StatusForbidden, gin.H{message.ERROR: createErr.Error()})
			return
		}
		saveErr := CreateAuth(int64(userId), ts)
		if saveErr != nil {
			c.JSON(http.StatusUnprocessableEntity, gin.H{message.ERROR: saveErr.Error()})
		}
		tokens := map[string]any{
			"access_token":             ts.AccessToken,
			"access_token_Expires_in":  int((ts.AtExpires)),
			"refresh_token":            ts.RefreshToken,
			"refresh_token_Expires_in": int(ts.RtExpires),
			"id":                       user.ID,
		}
		c.JSON(http.StatusCreated, tokens)
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{message.ERROR: message.REFRESH_TOKEN_EXPIRED})
	}
}

func FetchRefresh(refresh_uuid string) (models.User, error) {
	var user models.User
	affect := initializers.DB.First(&user, "refresh_uuid = ?", refresh_uuid)
	if affect.RowsAffected == constant.ZERO {
		return models.User{}, errors.New(message.UNAUTHORIZED)
	}
	return user, nil
}

func CreateTokenForDesktop(user models.User) (*dto.TokenDetails, error) {
	userid := user.ID
	td := &dto.TokenDetails{}
	td.DesktopUuid = uuid.NewV4().String() + strconv.Itoa(int(userid))
	var err error
	//Creating Access Token
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["desktop_uuid"] = td.DesktopUuid
	atClaims["user_id"] = userid
	atClaims["role"] = user.Role
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	td.AccessToken, err = at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
	if err != nil {
		return nil, err
	}
	return td, nil
}
