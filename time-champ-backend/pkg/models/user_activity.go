package models

import (
	"time"

	"github.com/tracker/pkg/enum"
)

type UserActivity struct {
	ID               uint `gorm:"primarykey"`
	StartTime        time.Time
	EndTime          time.Time
	SpentTime        time.Duration
	Reason           string
	WorkingStatus    enum.WorkingStatus
	ActivityStatus   enum.UserActivityStatus
	Status           enum.Status
	UserAttendanceID int `gorm:"column:userAttendance_id"`
	UserAttendance   UserAttendance
}
