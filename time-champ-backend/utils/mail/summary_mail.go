package mail

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"strings"
	"time"

	"github.com/tracker/initializers"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/repository"
	"golang.org/x/exp/slices"
	"gopkg.in/gomail.v2"
)

func SummaryMail() {
	today := time.Now()
	yesterday := today.AddDate(constant.ZERO, constant.ZERO, -constant.ONE).Format(constant.DATE)
	formattedDate := today.AddDate(constant.ZERO, constant.ZERO, -constant.ONE).Format(constant.DATE_MONTH)
	appSummary, _ := repository.DB().GetAppSummary(yesterday, yesterday)
	userList, _ := repository.DB().GetUserDetailsForSummaryReport()
	var presentListIds []uint
	for _, val := range appSummary {
		presentListIds = append(presentListIds, val.UserID)
		if val.TotalTime != constant.ZERO && val.Email != constant.NULL {
			presentSummarryReport(val, formattedDate)
		}
	}
	for _, val := range userList {
		if val.Email != constant.NULL && !slices.Contains(presentListIds, val.ID) {
			absentSummarry(val.Email, yesterday, val.Name)
		}
	}
}

func presentSummarryReport(attendanceSummary dto.AppActivitySummaryDTO, formattedDate string) {
	path, pathError := initializers.Path("present_summary.html")
	if pathError != nil {
		log.Fatal("Error loading File Path", pathError)
		return
	}
	t, err := template.ParseFiles(path)
	if err != nil {
		log.Println(err)
	}
	var values []string
	if err := json.Unmarshal([]byte(attendanceSummary.AppList), &values); err != nil {
		log.Fatal(err)
	}
	html := "<ul>\n"
	for _, item := range values {
		html += fmt.Sprintf("<li>%s</li>\n", item)
	}
	html += "</ul>"

	var tpl bytes.Buffer
	if err := t.Execute(&tpl, nil); err != nil {
		log.Println(err)
	}
	var body dto.AttendanceSummary
	body.Name = attendanceSummary.UserName
	body.Date = formattedDate
	body.TotalTime = Converter(attendanceSummary.TotalTime)
	body.DeskTime = Converter(attendanceSummary.Working)
	body.IdeleTime = Converter(attendanceSummary.Idle)
	body.ProductiveTime = Converter(attendanceSummary.Productive)
	body.UnproductiveTime = Converter(attendanceSummary.Unproductive)
	body.NeutralTime = Converter(attendanceSummary.Neutral)
	body.List = template.HTML(html)
	// Create a buffer to store the rendered HTML
	buffer := new(strings.Builder)

	// Render the template with the provided data into the buffer
	err = t.Execute(buffer, body)
	if err != nil {
		log.Fatal(err)
	}

	// Get the compiled HTML from the buffer
	compiledHTML := buffer.String()

	config, err := LoadConfig(".")
	if err != nil {
		log.Fatal("could not load config", err)
		return
	}
	m := gomail.NewMessage()
	m.SetHeader("From", config.EmailFrom)
	m.SetHeader("To", attendanceSummary.Email)
	m.SetHeader("Subject", constant.P_SUMMARY_SUBJECT, formattedDate)
	m.SetBody("text/html", compiledHTML)

	// Create a new SMTP client
	d := gomail.NewDialer(config.SMTPHost, config.SMTPPort, config.EmailFrom, config.SMTPPass)

	// Send the email
	if err := d.DialAndSend(m); err != nil {
		log.Fatal(err)
		return
	}

	log.Println("Email sent successfully!")

}
func Converter(milliseconds time.Duration) string {
	duration := time.Duration(milliseconds) * time.Millisecond
	hours := int(duration.Hours())
	minutes := int(duration.Minutes()) % constant.SIXTY
	return fmt.Sprintf("%dhr %dmin", hours, minutes)
}

func absentSummarry(eMail string, date string, name string) {
	path, pathError := initializers.Path("absent_summary.html")
	if pathError != nil {
		log.Fatal("Error loading File Path", pathError)
		return
	}

	t, err := template.ParseFiles(path)
	if err != nil {
		log.Println(err)
		return
	}
	t, err = t.ParseFiles(path)
	if err != nil {
		log.Println(err)
		return
	}

	var tpl bytes.Buffer
	if err := t.Execute(&tpl, err); err != nil {
		log.Println(err)
		return
	}
	var tContent string = constant.AB_SUMMARY_I
	var mContent string = constant.AB_SUMMARY_II
	var bContent string = constant.AB_SUMMARY_III
	data := struct {
		Name   string
		Top    string
		Middle string
		Bottom string
	}{
		Name:   name,
		Top:    tContent,
		Middle: mContent,
		Bottom: bContent,
	}

	// Create a buffer to store the rendered HTML
	buffer := new(strings.Builder)

	// Render the template with the provided data into the buffer
	err = t.Execute(buffer, data)
	if err != nil {
		log.Fatal(err)
		return
	}

	// Get the compiled HTML from the buffer
	compiledHTML := buffer.String()

	config, err := LoadConfig(".")
	if err != nil {
		log.Fatal("could not load config", err)
		return
	}
	m := gomail.NewMessage()
	m.SetHeader("From", config.EmailFrom)
	m.SetHeader("To", eMail)
	m.SetHeader("Subject", constant.AB_SUMMARY_SUBJECT, date)
	m.SetBody("text/html", compiledHTML)

	// Create a new SMTP client
	d := gomail.NewDialer(config.SMTPHost, config.SMTPPort, config.EmailFrom, config.SMTPPass)

	// Send the email
	if err := d.DialAndSend(m); err != nil {
		log.Fatal(err)
		return
	}
	log.Println("Email sent successfully!")
}
