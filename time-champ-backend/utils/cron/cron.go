package cron

import (
	"github.com/robfig/cron"
	"github.com/tracker/utils/mail"
)

func RunCron() {
	c := cron.New()
	c.AddFunc("0 0 11 ? * *", mail.SummaryMail)
	c.Start()
}
