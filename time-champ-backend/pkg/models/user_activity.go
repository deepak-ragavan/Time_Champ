package models

import (
	"time"

	"github.com/tracker/pkg/enum"
	"gorm.io/gorm"
)

type UserActivity struct {
	gorm.Model
	StartTime        time.Time               `json:"startTime"`
	EndTime          time.Time               `json:"endTime"`
	SpentTime        time.Duration           `json:"spentTime"`
	Reason           string                  `json:"reason"`
	WorkingStatus    enum.WorkingStatus      `json:"workingStatus"`
	ActivityStatus   enum.UserActivityStatus `json:"activityStatus"`
	Status           enum.Status             `json:"status"`
	UserAttendanceID uint                     `json:"userAttendanceId" gorm:"column:userAttendance_id"`
	UserAttendance   UserAttendance          `json:"userAttendance"`
}
