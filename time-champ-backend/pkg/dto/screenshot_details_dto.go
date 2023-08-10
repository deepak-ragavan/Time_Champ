package dto

import (
	"time"
)

type ScreenshotDetails struct {
	ID         uint      `json:"id"`
	Name       string    `json:"name"`
	Screenshot []byte    `json:"screenshot"`
	StartTime  time.Time `json:"startTime"`
	UserID     uint      `json:"userId" gorm:"column:user_id"`
	User       *User     `json:"user,omitempty"`
}
