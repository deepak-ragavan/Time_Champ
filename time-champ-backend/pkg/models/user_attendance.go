package models

import "time"

type UserAttendance struct {
	ID           int `gorm:"primary_key, AUTO_INCREMENT"`
	StartTime    time.Time
	EndTime      time.Time
	Idle         time.Duration
	Working      time.Duration
	NonWorking   time.Duration
	BreakTime    time.Duration
	TotalTime    time.Duration
	UserID       int            `gorm:"column:user_id"`
	UserActivity []UserActivity `gorm:"ForeignKey:UserAttendanceID"`
}
