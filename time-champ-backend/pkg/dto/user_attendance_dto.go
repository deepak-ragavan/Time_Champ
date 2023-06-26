package dto

import "time"

type UserAttendanceDto struct {
	ID           int
	StartTime    time.Time
	EndTime      time.Time
	Idle         time.Duration
	Working      time.Duration
	NonWorking   time.Duration
	BreakTime    time.Duration
	UserID       int
	UserActivity []UserActivityDto
}
