package cronjobs

import (
	"github.com/robfig/cron"
	"github.com/tracker/common/mail"
	"github.com/tracker/pkg/service"
)

func RunCron() {
	c := cron.New()
	c.AddFunc("0 0 11 ? * *", mail.SummaryMail)
	c.Start()
}

func UpdateUserActivityCron() {
	c := cron.New()
	c.AddFunc("0 0 6 ? * *", service.UpdateUserActivity)
	c.Start()
}
