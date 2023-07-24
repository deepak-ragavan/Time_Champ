package dto

import (
	"time"

	"github.com/tracker/pkg/enum"
)

type AppActivity struct {
	ID                uint                   `json:"id"`
	AppName           string                 `json:"appName"`
	ImageUrl          string                 `json:"imageUrl"`
	Title             string                 `json:"title"`
	StartTime         time.Time              `json:"startTime"`
	EndTime           time.Time              `json:"endTime"`
	SpentTime         time.Duration          `json:"spentTime"`
	AppActivityStatus enum.AppActivityStatus `json:"appActivityStatus"`
	UserID            uint                   `json:"-" gorm:"column:user_id"`
	User              User                   `json:"user"`
}

type AppActivitySpendTimeDto struct {
	AppName   string        `json:"appName"`
	SpentTime time.Duration `json:"spentTime"`
	ImageUrl  string        `json:"imageUrl"`
}

type AppSpendTimeDto struct {
	Title     string        `json:"title"`
	SpentTime time.Duration `json:"spentTime"`
	ImageUrl  string        `json:"imageUrl"`
}

type TotalAppActivity struct {
	Productive   time.Duration `json:"productive"`
	Unproductive time.Duration `json:"unproductive"`
	Neutral      time.Duration `json:"neutral"`
	DeskTime     time.Duration `json:"deskTime"`
}

type AppActivityStatus struct {
	Productive   []AppActivitySpendTimeDto `json:"productive"`
	Unproductive []AppActivitySpendTimeDto `json:"unproductive"`
	Neutral      []AppActivitySpendTimeDto `json:"neutral"`
	TopFiveApp   []AppActivitySpendTimeDto `json:"topFiveApp"`
}

type AppActivitySummaryMail struct {
	UserID    uint
	AppName   string
	SpentTime int
	StartTime string
}
