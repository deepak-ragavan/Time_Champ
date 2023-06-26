package authentication

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tracker/initializers"
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/models"
	"golang.org/x/crypto/bcrypt"
)

func Login(c *gin.Context) {
	// get the email and pass off req body
	var body dto.UserDto
	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to read body"})
		return
	}

	//look up requested user
	var user models.User
	initializers.DB.First(&user, "email = ?", body.Email)

	if user.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email or password"})
		return
	}
	//compare sent in pass with saved user pass hash
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Email or Password"})
		return
	}
	tokens, err := GenerateToken(int64(user.ID))
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}
	//sent it back
	c.JSON(http.StatusOK, tokens)
}
func CreateAuth(userid int64, td *dto.TokenDetails) error {
	var user models.User
	affect := initializers.DB.First(&user, int(userid))
	if affect.RowsAffected == 0 {
		return errors.New("user not found")
	}
	user.AccessUuid = td.AccessUuid
	user.RefreshUuid = td.RefreshUuid
	errAccess := initializers.DB.Save(&user)
	if errAccess.RowsAffected == 0 {
		return errors.New("AccessUuid not found")
	}
	return nil
}
func GenerateToken(id int64) (map[string]any, error) {
	ts, err := CreateToken(id)
	if err != nil {
		return nil, errors.New(" UnprocessableEntity")
	}

	saveErr := CreateAuth(id, ts)
	if saveErr != nil {
		return nil, errors.New(" UnprocessableEntity")
	}
	//sent it back
	tokens := map[string]any{
		"access_token":             ts.AccessToken,
		"access_token_Expires_in":  int((ts.AtExpires)),
		"refresh_token":            ts.RefreshToken,
		"refresh_token_Expires_in": int(ts.RtExpires),
	}
	return tokens, nil
}
