package forgetpassword

import (
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"strings"

	"time"

	"github.com/gin-gonic/gin"
	"github.com/tracker/initializers"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/constant/message"
	"github.com/tracker/pkg/models"
	"github.com/tracker/pkg/repository"
	utils "github.com/tracker/utils/mail"
	"golang.org/x/crypto/bcrypt"
)

func ForgotPassword(c *gin.Context) {
	email := c.Query("email")
	result, err := repository.DB().GetByMailId(strings.ToLower(email))
	if err.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.INVALID_EMAIL_MESSAGE})
		return
	}
	if result.Password == constant.NULL {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.NOT_EXISTS_MESSAGE})
		return
	}
	// Generate Verification Code
	rand := rand.Intn(constant.RAND_NUMBER) + constant.RAND_NUMBER
	generateOtp := strconv.Itoa(rand)
	log.Println(generateOtp)
	passwordResetToken := utils.Encode(generateOtp)
	result.PasswordResetToken = passwordResetToken
	result.PasswordResetAt = time.Now().Add(time.Minute * 15)
	initializers.DB.Save(&result)
	utils.SendOtpMail(&result, generateOtp)
	c.JSON(http.StatusOK, gin.H{message.MESSAGE: message.RESET_EMAIL_MESSAGE})
}

func ResetPassword(c *gin.Context) {
	otp := c.Query("otp")
	password := c.Query("password")
	confirmPassword := c.Query("confirmPassword")
	if otp == constant.NULL {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.ENTER_VALID_OTP_MESSAGE})
		return
	}
	if password != confirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.PASSWORDS_DO_NOT_MATCH_MESSAGE})
		return
	}
	hashedPassword, _ := hashedPasswordGenerater(password)
	passwordResetToken := utils.Encode(otp)
	var updatedUser models.User
	result := initializers.DB.Where("password_reset_token = ?", passwordResetToken).
		Where("password_reset_at > ?", time.Now()).
		First(&updatedUser)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.INVALID_OR_EXPIRED_OTP_MESSAGE})
		return
	}
	updatedUser.Password = string(hashedPassword)
	updatedUser.PasswordResetToken = constant.NULL
	initializers.DB.Save(&updatedUser)
	c.JSON(http.StatusOK, gin.H{message.MESSAGE: message.PASSWORD_UPDATED_SUCCESS_MESSAGE})
}

func UpdatePassword(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, _ := strconv.Atoi(c.Query("userId"))
	password := c.Query("password")
	confirmPassword := c.Query("confirmPassword")
	user, mess := repository.DB().GetUser(uint(id))
	if mess == nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.USER_NOT_FOUND})
		return
	}
	if password != confirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.PASSWORDS_DO_NOT_MATCH_MESSAGE})
		return
	}
	hashedPassword, _ := hashedPasswordGenerater(password)
	user.Password = string(hashedPassword)
	repository.DB().SaveUser(user)
	c.JSON(http.StatusOK, gin.H{message.MESSAGE: message.PASSWORD_UPDATED_SUCCESS_MESSAGE})
}

func hashedPasswordGenerater(password string) ([]byte, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), constant.HASHED_PASSWORD_ITERATIONS)
	return hashedPassword, err
}
