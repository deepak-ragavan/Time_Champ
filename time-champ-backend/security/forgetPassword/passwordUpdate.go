package forgetpassword

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/thanhpk/randstr"
	"github.com/tracker/initializers"
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/models"
	"github.com/tracker/utils"
	"golang.org/x/crypto/bcrypt"
)

func ForgotPassword(c *gin.Context) {
	var payload *dto.ForgotPasswordInput

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	message := "You will receive a reset email if user with that email exist"

	var user models.User
	result := initializers.DB.First(&user, "email = ?", strings.ToLower(payload.Email))
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email or Password"})
		return
	}

	// Generate Verification Code
	generateOtp := randstr.String(6)
	fmt.Println(generateOtp)
	passwordResetToken := utils.Encode(generateOtp)
	fmt.Println(passwordResetToken)
	user.PasswordResetToken = passwordResetToken
	user.PasswordResetAt = time.Now().Add(time.Minute * 15)
	fmt.Println(user)
	initializers.DB.Save(&user)

	utils.SendOtpMail(&user, generateOtp)
	c.JSON(http.StatusOK, gin.H{"message": message})
}

func ResetPassword(c *gin.Context) {
	var payload *dto.ResetPasswordInput
	otp := c.Query("otp")
	if otp == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Entery valid OTP"})
	}
	fmt.Println(otp)
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if payload.Password != payload.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Passwords do not match"})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(payload.Password), 10)
	passwordResetToken := utils.Encode(otp)
	var updatedUser models.User

	result := initializers.DB.Where("password_reset_token = ?", passwordResetToken).
		Where("password_reset_at > ?", time.Now()).
		First(&updatedUser)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "The reset token is invalid or has expired"})
		return
	}

	updatedUser.Password = string(hashedPassword)
	updatedUser.PasswordResetToken = ""
	initializers.DB.Save(&updatedUser)
	c.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})
}
