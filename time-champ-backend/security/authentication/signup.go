package authentication

import (
	"net/http"
	"time"

	emailverifier "github.com/AfterShip/email-verifier"
	"github.com/gin-gonic/gin"

	"github.com/tracker/initializers"
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/models"
	"golang.org/x/crypto/bcrypt"
)

var (
	verifier = emailverifier.NewVerifier()
)

func Signup(c *gin.Context) {
	//get the email/pass off req body
	var body dto.UserDto
	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to read body"})
		return
	}
	check := validateMailId(body.Email, c)
	if check != string(rune(http.StatusOK)) {
		c.JSON(http.StatusBadRequest, gin.H{"error": check})
		return

	}

	//Hash the password
	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to hash the password"})
		return
	}

	//create the user
	user := models.User{Email: body.Email, Password: string(hash)}
	user.PasswordResetAt = time.Now()
	result := initializers.DB.Create(&user)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to create the user"})
		return
	}
	tokens, err := GenerateToken(int64(user.ID))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	//sent it back
	c.JSON(http.StatusOK, tokens)
}

func validateMailId(emailId string, c *gin.Context) string {
	verifier = verifier.EnableSMTPCheck()
	verifier = verifier.EnableDomainSuggest()
	verifier = verifier.AddDisposableDomains([]string{"tractorjj.com"})

	ret, err := verifier.Verify(emailId)
	if err != nil {

		return "unable to register email addresss, please try again"
	}

	// needs @ and . for starters
	if !ret.Syntax.Valid {

		return "email address syntax is invalid"
	}
	if ret.Disposable {

		return "sorry, we do not accept disposable email addresses"
	}
	if ret.Suggestion != "" {

		return "email address is not reachable, looking for " + ret.Suggestion + " instead?"
	}
	// possible return string values: yes, no, unkown
	if ret.Reachable == "no" {

		return "email address was unreachable"
	}
	// check MX records so we know DNS setup properly to recieve emails
	if !ret.HasMxRecords {

		return "domain entered not properly setup to recieve emails, MX record not found"
	}
	return string(rune(http.StatusOK))

}
