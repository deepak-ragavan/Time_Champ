package service

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/constant/message"
	"github.com/tracker/pkg/dto"

	"github.com/tracker/pkg/repository"
)

func GetUrlActivity(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, er := strconv.Atoi(c.Param("id"))
	if er != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.PATHVARIABLE_CONVERSION_TO_INT_FAILED})
		return
	}
	urlActivity, af := repository.DB().GetUrlActivity(uint(id))
	if af.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: af.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, urlActivity)
}

func SaveUrlActivity(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	var urlActivity dto.UrlActivity
	if c.ShouldBindBodyWith(&urlActivity, binding.JSON) != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.FAILED_TO_READ_BODY})
		return
	}
	if urlActivity.ID != constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.INVALID_RESPONSE_BODY_ID})
		return
	}
	urlActivity.UserID = urlActivity.ID
	urlActivity, af := repository.DB().SaveUrlActivity(urlActivity)
	if af.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: af.Error.Error()})
		return
	}
	c.JSON(http.StatusCreated, urlActivity)
}

func GetUrlActivityByUserId(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, er := strconv.Atoi(c.Query("userId"))
	if er != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.PATHVARIABLE_CONVERSION_TO_INT_FAILED})
		return
	}
	urlActivity, af := repository.DB().GetUrlActivityByUserId(uint(id))
	if af.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.RECORD_NOT_FOUND})
		return
	}
	c.JSON(http.StatusOK, urlActivity)
}

func DeleteUrlActivity(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, er := strconv.Atoi(c.Param("id"))
	if er != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.PATHVARIABLE_CONVERSION_TO_INT_FAILED})
		return
	}
	af := repository.DB().DeleteUrlActivity(uint(id))
	if af.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.RECORD_NOT_FOUND})
		return
	}
	c.JSON(http.StatusBadRequest, gin.H{message.MESSAGE: message.APPACTIVITY_DELETED})
}
