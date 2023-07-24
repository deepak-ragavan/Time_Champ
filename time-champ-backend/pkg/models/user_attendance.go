package models

import (
	"time"

	"gorm.io/gorm"
)

type UserAttendance struct {
	gorm.Model
	StartTime    time.Time      `json:"startTime"`
	EndTime      time.Time      `json:"endTime"`
	Idle         time.Duration  `json:"idle"`
	Working      time.Duration  `json:"working"`
	NonWorking   time.Duration  `json:"nonWorking"`
	BreakTime    time.Duration  `json:"breakTime"`
	TotalTime    time.Duration  `json:"totalTime"`
	UserID       uint           `json:"userId" gorm:"column:user_id"`
	User         User           `json:"user"`
	UserActivity []UserActivity `json:"userActivity" gorm:"ForeignKey:UserAttendanceID"`
	Productive   time.Duration  `json:"productive"`
	Unproductive time.Duration  `json:"unproductive"`
	Neutral      time.Duration  `json:"neutral"`
	DeskTime     time.Duration  `json:"deskTime"`
}
