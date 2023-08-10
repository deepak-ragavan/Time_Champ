package forgetpassword

import (
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"strings"

	"time"

	"github.com/gin-gonic/gin"
	"github.com/tracker/common/mail"
	"github.com/tracker/initializers"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/constant/message"
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/models"
	"github.com/tracker/pkg/repository"

	"golang.org/x/crypto/bcrypt"
)

func SendOtpToMail(c *gin.Context) {
	email := c.Query("email")
	result, err := repository.DB().GetByMailId(strings.ToLower(email))
	if err.RowsAffected == constant.ZERO {
		c.JSON(http.StatusUnauthorized, gin.H{message.ERROR: message.INVALID_EMAIL_MESSAGE})
		return
	}
	if result.IsDeleted {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.USER_DELEDED})
		return
	}
	if result.IsBlocked {
		c.JSON(http.StatusNotFound, gin.H{message.ERROR: message.USER_BLOCKED})
		return
	}
	if result.Password == constant.NULL {
		c.JSON(http.StatusUnauthorized, gin.H{message.ERROR: message.NOT_EXISTS_MESSAGE})
		return
	}
	currentDate := time.Now().Format(constant.DATE)
	if (result.LastOTPTime.IsZero()) || (result.LastOTPTime.Format(constant.DATE) == currentDate && result.ResetAttempts < constant.FIVE) {
		result.LastOTPTime = time.Now()
		result.ResetAttempts = result.ResetAttempts + constant.ONE
	} else if result.LastOTPTime.Format(constant.DATE) != currentDate {
		result.ResetAttempts = constant.ZERO
		result.LastOTPTime = time.Now()
		result.ResetAttempts = result.ResetAttempts + constant.ONE
	} else if result.LastOTPTime.Format(constant.DATE) == currentDate && result.ResetAttempts >= constant.FIVE {
		result.IsBlocked = true
		initializers.DB.Save(&result)
		c.JSON(http.StatusOK, gin.H{message.MESSAGE: message.USER_BLOCKED})
		return
	}
	// Generate Verification Code
	rand := rand.Intn(constant.RAND_NUMBER) + constant.RAND_NUMBER
	generateOtp := strconv.Itoa(rand)
	log.Println(generateOtp)
	passwordResetToken := mail.Encode(generateOtp)
	result.PasswordResetToken = passwordResetToken
	result.PasswordResetAt = time.Now().Add(time.Minute * 15)
	initializers.DB.Save(&result)
	mail.SendOtpMail(&result, generateOtp)
	c.JSON(http.StatusOK, gin.H{message.MESSAGE: message.RESET_EMAIL_MESSAGE})
}

func OtpValidation(c *gin.Context) {
	otp := c.Query("otp")
	email := c.Query("email")
	if otp == constant.NULL {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.ENTER_VALID_OTP_MESSAGE})
		return
	}
	passwordResetToken := mail.Encode(otp)
	var updatedUser models.User
	result := initializers.DB.Where("password_reset_token = ? And email=?", passwordResetToken, email).
		Where("password_reset_at > ?", time.Now()).
		First(&updatedUser)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.INVALID_OR_EXPIRED_OTP_MESSAGE})
		return
	}
	updatedUser.OtpVerifed = true
	updatedUser.PasswordResetToken = constant.NULL
	initializers.DB.Save(&updatedUser)
	c.JSON(http.StatusOK, gin.H{message.MESSAGE: message.OTP_VERIFIED})
}

func ResetPassword(c *gin.Context) {
	var payload dto.ResetPasswordInput
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.FAILED_TO_READ_BODY})
		return
	}
	if payload.Password != payload.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.PASSWORDS_MISS_MATCH})
		return
	}
	var updatedUser models.User
	result := initializers.DB.Where("email=?", payload.Email).
		Where("password_reset_at > ?", time.Now()).
		First(&updatedUser)
	if !updatedUser.OtpVerifed {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.OTP_VERIFICATION_FAILED})
		return
	}
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.INVALID_OR_EXPIRED_OTP_MESSAGE})
		return
	}
	passwordData := changePassword(payload.Password, updatedUser)
	if passwordData == constant.NULL {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.PASSWORD_UPDATED_FAILURE_MESSAGE})
	}
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
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.PASSWORDS_MISS_MATCH})
		return
	}
	result := changePassword(password, user)
	if result == constant.NULL {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.PASSWORD_UPDATED_FAILURE_MESSAGE})
	}
	c.JSON(http.StatusOK, gin.H{message.MESSAGE: result})
}

func hashedPasswordGenerater(password string) ([]byte, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), constant.HASHED_PASSWORD_ITERATIONS)
	return hashedPassword, err
}

func changePassword(password string, user models.User) string {
	hashedPassword, _ := hashedPasswordGenerater(password)
	user.Password = string(hashedPassword)
	user.PasswordResetToken = constant.NULL
	user.OtpVerifed = false
	repository.DB().SaveUser(user)
	return message.PASSWORD_UPDATED_SUCCESS_MESSAGE
}
