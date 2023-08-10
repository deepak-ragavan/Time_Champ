package service

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/constant/message"
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/repository"
)

func Validate(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	user, _ := repository.DB().GetUser(userId)
	c.JSON(http.StatusOK, user)
}

func GetChildUser(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, er := strconv.Atoi(c.Query("userId"))
	if er != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.QUERY_PARAM_CONVERSION_TO_INT_FAILED})
		return
	}
	users, aff := GetUserData(uint(id))
	if aff != constant.NULL || users == nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.RECORD_NOT_FOUND})
		return
	}
	c.JSON(http.StatusOK, users)
}

func GetUserData(id uint) ([]dto.Users, string) {
	var users []dto.Users
	userData, aff := repository.DB().GetChildUser(id)
	if aff.RowsAffected <= constant.ZERO {
		return nil, message.RECORD_NOT_FOUND
	}
	users = append(users, SetUserData(userData))
	for _, child := range userData.ChildUser {
		if !child.IsDeleted || !child.IsBlocked {
			users = append(users, SetUserData(child))
		}
	}
	return users, constant.NULL
}

func SetUserData(userData dto.User) dto.Users {
	var user dto.Users
	user.ID = userData.ID
	user.Name = userData.Name
	user.Role = userData.Role
	return user
}

func GetChildUserIds(id uint) ([]uint, string) {
	var listOfIds []uint
	childList, _ := GetUserData(id)
	for _, childId := range childList {
		listOfIds = append(listOfIds, childId.ID)
	}
	return listOfIds, constant.NULL
}
