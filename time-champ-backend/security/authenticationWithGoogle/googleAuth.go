package authenticationwithgoogle

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/tracker/initializers"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/constant/message"
	"github.com/tracker/pkg/enum"
	"github.com/tracker/pkg/models"
	"github.com/tracker/security/authentication"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var (
	oauthConfGl = &oauth2.Config{
		ClientID:     constant.NULL,
		ClientSecret: constant.NULL,
		RedirectURL:  constant.NULL,
		Scopes:       []string{},
		Endpoint:     google.Endpoint,
	}
	oauthStateStringGl = constant.NULL
)

func HandleGoogleLogin(w http.ResponseWriter, r *http.Request) {
	oauthConfGl.ClientID = os.Getenv("CLIENT_ID")
	oauthConfGl.ClientSecret = os.Getenv("CLIENT_SECRET")
	oauthConfGl.RedirectURL = os.Getenv("REDIRECT_URL")
	oauthConfGl.Scopes = []string{os.Getenv("EMAIL_SCOPE"), os.Getenv("PROFILE_SCOPE")}
	oauthStateStringGl = os.Getenv("OAUTHSTATE")
	HandleLogin(w, r, oauthConfGl, oauthStateStringGl)
}

/*
CallBackFromGoogle Function
*/
func CallBackFromGoogle(w http.ResponseWriter, r *http.Request) {
	state := r.FormValue("state")
	if state != oauthStateStringGl {
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}
	code := r.FormValue("code")
	if code == constant.NULL {

		w.Write([]byte("Code Not Found to provide AccessToken..\n"))
		reason := r.FormValue("error_reason")
		if reason == "user_denied" {
			w.Write([]byte("User has denied Permission.."))
		}
		// User has denied access..
		// http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
	} else {
		token, err := oauthConfGl.Exchange(oauth2.NoContext, code)
		if err != nil {
			return
		}
		resp, err := http.Get(os.Getenv("GOOGLE_USER_INFO_GET_API") + url.QueryEscape(token.AccessToken))
		if err != nil {
			log.Fatal("Get: " + err.Error() + "\n")
			http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
			return
		}
		defer resp.Body.Close()

		response, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			log.Fatal("ReadAll: " + err.Error() + "\n")
			http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
			return
		}
		jsonString := string(response)
		var jsonMap map[string]interface{}
		json.Unmarshal([]byte(jsonString), &jsonMap)
		email, emailExists := jsonMap["email"]
		name, nameExists := jsonMap["name"]
		if emailExists {
			var user models.User
			affect := initializers.DB.First(&user, "email = ?", fmt.Sprintf("%v", email))
			if affect.RowsAffected != constant.ZERO {
				if user.Password != constant.NULL {
					w.Write([]byte(message.ERROR + constant.COLON + message.UNAUTHORIZED))
					return
				}
				if user.Name != fmt.Sprintf("%v", name) {
					user.Name = fmt.Sprintf("%v", name)
					initializers.DB.Save(&user)

				}
			} else {
				user.Email = fmt.Sprintf("%v", email)
				user.Role = enum.USER
				if nameExists {
					user.Name = fmt.Sprintf("%v", name)
				}
				initializers.DB.Save(&user)
				affect := initializers.DB.First(&user, "email = ?", user.Email)
				if affect.RowsAffected == constant.ZERO {
					w.Write([]byte(message.ERROR + constant.COLON + message.UNAUTHORIZED))
					return
				}
			}
			tokens, err := authentication.GenerateToken(user)
			if err != nil {
				w.Write([]byte(message.ERROR + constant.COLON + message.UNAUTHORIZED))
				return
			}
			json.NewEncoder(w).Encode(tokens)
			return
		}
	}
}
