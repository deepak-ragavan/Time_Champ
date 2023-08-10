package mail

import (
	"bytes"
	"encoding/base64"
	"html/template"
	"log"
	"os"
	"strings"

	"github.com/spf13/viper"
	"github.com/tracker/initializers"
	"github.com/tracker/pkg/models"
	"gopkg.in/gomail.v2"
)

func Encode(s string) string {
	data := base64.StdEncoding.EncodeToString([]byte(s))
	return string(data)
}

type Config struct {
	EmailFrom    string `mapstructure:"EMAIL_FROM"`
	SMTPHost     string `mapstructure:"SMTP_HOST"`
	SMTPPass     string `mapstructure:"SMTP_PASS"`
	SMTPPort     int    `mapstructure:"SMTP_PORT"`
	SMTPUser     string `mapstructure:"SMTP_USER"`
	SMTPAdd      string `mapstructure:"SMTP_USER"`
	ClientOrigin string `mapstructure:"CLIENT_ORIGIN"`
}

func LoadConfig(path string) (config Config, err error) {
	config.EmailFrom = os.Getenv("EMAIL_FROM")
	config.SMTPHost = os.Getenv("SMTP_HOST")
	config.SMTPPass = os.Getenv("SMTP_PASS")
	config.SMTPPort = 587
	config.SMTPUser = os.Getenv("SMTP_USER")
	config.ClientOrigin = os.Getenv("CLIENT_ORIGIN")
	if err != nil {
		return
	}

	err = viper.Unmarshal(&config)
	return
}

func SendOtpMail(user *models.User, otp string) {
	path, pathError := initializers.Path("forget_password.html")
	if pathError != nil {
		log.Fatal("Error loading File Path", pathError)
		return
	}
	t := template.New("forget_password.html")

	var err error
	t, err = t.ParseFiles(path)
	if err != nil {
		log.Println(err)
	}

	var tpl bytes.Buffer
	if err := t.Execute(&tpl, err); err != nil {
		log.Println(err)
	}
	data := struct {
		Otp string
	}{
		Otp: otp,
	}

	// Create a buffer to store the rendered HTML
	buffer := new(strings.Builder)

	// Render the template with the provided data into the buffer
	err = t.Execute(buffer, data)
	if err != nil {
		log.Fatal(err)
	}

	// Get the compiled HTML from the buffer
	compiledHTML := buffer.String()

	config, err := LoadConfig(".")
	if err != nil {
		log.Fatal("could not load config", err)
	}
	m := gomail.NewMessage()
	m.SetHeader("From", config.EmailFrom)
	m.SetHeader("To", user.Email)
	m.SetHeader("Subject", "Sentinel : Forget Password OTP")
	m.SetBody("text/html", compiledHTML)

	// Create a new SMTP client
	d := gomail.NewDialer(config.SMTPHost, config.SMTPPort, config.EmailFrom, config.SMTPPass)

	// Send the email
	if err := d.DialAndSend(m); err != nil {
		log.Fatal(err)
	}
	log.Println("Email sent successfully!")
}
