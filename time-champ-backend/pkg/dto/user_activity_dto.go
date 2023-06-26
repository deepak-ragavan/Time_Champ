package dto

import (
	"time"

	"github.com/tracker/pkg/enum"
)

type UserActivityDto struct {
	ID               uint
	StartTime        time.Time
	EndTime          time.Time
	SpentTime        time.Duration
	Reason           string
	WorkingStatus    enum.WorkingStatus
	ActivityStatus   enum.UserActivityStatus
	Status           enum.Status
	UserAttendanceID int
	UserAttendance   UserAttendanceDto
}
