package models

import (
	"time"

	"gorm.io/gorm"
)

type UrlActivity struct {
	gorm.Model
	AppName   string        `json:"appName"`
	UrlName   string        `json:"urlName"`
	StartTime time.Time     `json:"startTime"`
	EndTime   time.Time     `json:"endTime"`
	SpentTime time.Duration `json:"spentTime"`
	UserID    uint          `json:"userId" gorm:"column:user_id"`
	User      User          `json:"user"`
}
