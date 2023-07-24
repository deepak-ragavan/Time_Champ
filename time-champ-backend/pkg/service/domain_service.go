package service

import (
	"fmt"
	"net"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/constant/message"
	"github.com/tracker/pkg/models"

	"github.com/tracker/pkg/repository"
	"golang.org/x/crypto/bcrypt"
)

func CreateDomain(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	var body models.Domain
	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.FAILED_TO_READ_BODY})
		return
	}
	lowerStr := strings.ToLower(body.DomainName)
	_, errr := net.LookupIP(lowerStr)
	if errr != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.INVALID_DOMAIN})
		fmt.Printf("Error looking up IP for domain: %s\n", err.Error())
		return
	}
	//Hash the password
	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), constant.HASHED_PASSWORD_ITERATIONS)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.PASSWORD_HASHING_FAILED})
		return
	}
	domain := models.Domain{DomainName: lowerStr, Password: string(hash)}
	result, _ := repository.DB().SaveDomain(domain)
	if result.ID == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.DOMAIN_CREATION_FAILED})
		return
	}
	c.JSON(http.StatusOK, result)
}
