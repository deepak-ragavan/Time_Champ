package authentication

import (
	"fmt"
	"net/http"
	"strings"

	emailverifier "github.com/AfterShip/email-verifier"
	"github.com/gin-gonic/gin"
	"github.com/tracker/initializers"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/constant/message"
	"github.com/tracker/pkg/enum"
	"github.com/tracker/pkg/models"
	"github.com/tracker/pkg/repository"

	"golang.org/x/crypto/bcrypt"
)

var (
	verifier = emailverifier.NewVerifier()
)

func Signup(c *gin.Context) {
	//get the email/pass off req body
	var body models.User
	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.FAILED_TO_READ_BODY})
		return
	}
	check := validateMailId(body.Email, c)
	if check != string(rune(http.StatusOK)) {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: check})
		return
	}
	domain, domainErr := ExtractDomainFromEmail(body.Email)
	if domainErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.EMAIL_REGISTRATION_FAILED})
		return
	}
	domaindetails, _ := repository.DB().GetDomainByName(domain)
	if domaindetails.ID == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.INVALID_DOMAIN_ERROR})
		return
	}
	//Hash the password
	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), constant.HASHED_PASSWORD_ITERATIONS)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.PASSWORD_HASHING_FAILED})
		return
	}
	//create the user
	user := models.User{Email: body.Email, Password: string(hash), Role: enum.USER, DomainID: domaindetails.ID}
	result := initializers.DB.Create(&user)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.USER_CREATION_FAILED})
		return
	}
	tokens, err := GenerateToken(user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: err.Error()})
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

		return message.EMAIL_REGISTRATION_FAILED
	}

	// needs @ and . for starters
	if !ret.Syntax.Valid {

		return message.INVALID_EMAIL_SYNTAX
	}
	if ret.Disposable {

		return message.DISPOSABLE_EMAIL_NOT_ALLOWED
	}
	if ret.Suggestion != "" {

		return "email address is not reachable, looking for " + ret.Suggestion + " instead?"
	}
	// possible return string values: yes, no, unkown
	if ret.Reachable == "no" {

		return message.UNREACHABLE_EMAIL_ADDRESS
	}
	// check MX records so we know DNS setup properly to recieve emails
	if !ret.HasMxRecords {

		return message.INVALID_EMAIL_DOMAIN_SETUP
	}
	return string(rune(http.StatusOK))

}
func ExtractDomainFromEmail(email string) (string, error) {
	parts := strings.Split(email, constant.ATSYMBOL)
	if len(parts) != constant.TWO {
		return "", fmt.Errorf("invalid email address: %s", email)
	}
	domain := parts[constant.ONE]
	return domain, nil
}
