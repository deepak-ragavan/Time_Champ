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
	"github.com/tracker/pkg/enum"
	"github.com/tracker/pkg/models"
	"github.com/tracker/security/authentication"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var (
	oauthConfGl = &oauth2.Config{
		ClientID:     enum.NULL,
		ClientSecret: enum.NULL,
		RedirectURL:  enum.NULL,
		Scopes:       []string{},
		Endpoint:     google.Endpoint,
	}
	oauthStateStringGl = enum.NULL
)

func HandleGoogleLogin(w http.ResponseWriter, r *http.Request) {
	oauthConfGl.ClientID = os.Getenv("ClientID")
	oauthConfGl.ClientSecret = os.Getenv("ClientSecret")
	oauthConfGl.RedirectURL = os.Getenv("RedirectURL")
	oauthConfGl.Scopes = []string{os.Getenv("EmailScope"), os.Getenv("profileScope")}
	oauthStateStringGl = os.Getenv("oauthStateStringGl")
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

	if code == "" {
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

		resp, err := http.Get(os.Getenv("GoogleUserInfoGetApi") + url.QueryEscape(token.AccessToken))
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
			if affect.RowsAffected != 0 {
				if user.Password != enum.NULL {
					w.Write([]byte("error: Unauthorized"))
					return
				}
				if user.Name != fmt.Sprintf("%v", name) {
					user.Name = fmt.Sprintf("%v", name)
					initializers.DB.Save(&user)

				}
			} else {
				user.Email = fmt.Sprintf("%v", email)
				if nameExists {
					user.Name = fmt.Sprintf("%v", name)
				}
				initializers.DB.Save(&user)
				affect := initializers.DB.First(&user, "email = ?", user.Email)
				if affect.RowsAffected == 0 {
					w.Write([]byte("error: Unauthorized"))
					return
				}
			}
			tokens, err := authentication.GenerateToken(int64(user.ID))
			if err != nil {
				w.Write([]byte("error: Unauthorized"))
				return
			}
			json.NewEncoder(w).Encode(tokens)
			return
		}
	}
}
