package models

import (
	"time"

	"github.com/tracker/pkg/enum"
	"gorm.io/gorm"
)

type AppActivity struct {
	gorm.Model
	AppName           string                 `json:"appName"`
	ImageUrl          string                 `json:"imageUrl"`
	Title             string                 `json:"title"`
	StartTime         time.Time              `json:"startTime"`
	EndTime           time.Time              `json:"endTime"`
	SpentTime         time.Duration          `json:"spentTime"`
	AppActivityStatus enum.AppActivityStatus `json:"appActivityStatus"`
	UserID            uint                   `json:"userId" gorm:"column:user_id"`
	User              User                   `json:"user"`
}
