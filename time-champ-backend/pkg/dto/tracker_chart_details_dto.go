package dto

import (
	"time"
)

type TrackerChartDetails struct {
	ID            uint          `json:"id"`
	KeyStroke     int32         `json:"keyStroke"`
	MouseMovement int32         `json:"mouseMovement"`
	StartTime     time.Time     `json:"startTime"`
	EndTime       time.Time     `json:"endTime"`
	SpentTime     time.Duration `json:"spentTime"`
	UserID        uint          `json:"userId" gorm:"column:user_id"`
	User          *User         `json:"user,omitempty"`
}

type TrackerChartAndScreenshotDetails struct {
	ID            uint         `json:"id"`
	KeyStroke     int32        `json:"keyStroke"`
	MouseMovement int32        `json:"mouseMovement"`
	StartTime     time.Time    `json:"startTime"`
	EndTime       time.Time    `json:"endTime"`
	Screenshots   []Screenshot `json:"screenshots"`
}

type Screenshot struct {
	Screenshot []byte    `json:"screenshot"`
	StartTime  time.Time `json:"startTime"`
	Name       string    `json:"name"`
}
