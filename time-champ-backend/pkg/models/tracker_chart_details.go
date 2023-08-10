package models

import (
	"time"

	"gorm.io/gorm"
)

type TrackerChartDetails struct {
	gorm.Model
	KeyStroke     int32         `json:"keyStroke"`
	MouseMovement int32         `json:"mouseMovement"`
	StartTime     time.Time     `json:"startTime"`
	EndTime       time.Time     `json:"endTime"`
	SpentTime     time.Duration `json:"spentTime"`
	UserID        uint          `json:"userId" gorm:"column:user_id"`
	User          User          `json:"user"`
}
