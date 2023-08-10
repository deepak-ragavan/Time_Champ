package models

import (
	"time"

	"gorm.io/gorm"
)

type ScreenshotDetails struct {
	gorm.Model
	Name       string    `json:"name"`
	Screenshot []byte    `json:"screenshot"`
	StartTime  time.Time `json:"startTime"`
	UserID     uint      `json:"userId" gorm:"column:user_id"`
	User       User      `json:"user"`
}
