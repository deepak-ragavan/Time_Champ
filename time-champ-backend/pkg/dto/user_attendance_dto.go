package dto

import "time"

type UserAttendance struct {
	ID           uint            `json:"id"`
	StartTime    time.Time       `json:"startTime"`
	EndTime      time.Time       `json:"endTime"`
	Idle         time.Duration   `json:"idle"`
	Working      time.Duration   `json:"working"`
	NonWorking   time.Duration   `json:"nonWorking,omitempty"`
	BreakTime    time.Duration   `json:"breakTime"`
	TotalTime    time.Duration   `json:"totalTime"`
	Productive   time.Duration   `json:"productive"`
	Unproductive time.Duration   `json:"unproductive"`
	Neutral      time.Duration   `json:"neutral"`
	DeskTime     time.Duration   `json:"deskTime"`
	UserID       uint            `json:"-" gorm:"column:user_id"`
	User         *User           `json:"user,omitempty"`
	UserActivity *[]UserActivity `json:"userActivity,omitempty" gorm:"ForeignKey:UserAttendanceID"`
}
type AttendanceSummary struct {
	Name             string
	Date             string
	TotalTime        string
	DeskTime         string
	IdeleTime        string
	ProductiveTime   string
	UnproductiveTime string
	NeutralTime      string
	List             interface{}
}

type AppActivitySummaryDTO struct {
	UserID       uint
	Email        string
	EmployeeID   string
	Date         string
	UserName     string
	AppUserID    uint
	AppTime      string
	AppName      string
	SpentTime    int
	AttID        uint
	Idle         time.Duration
	Working      time.Duration
	NonWorking   time.Duration
	BreakTime    time.Duration
	TotalTime    time.Duration
	Productive   time.Duration
	Unproductive time.Duration
	Neutral      time.Duration
	AttUserID    uint
	StartTime    string
	UserRows     int
	AppList      string
}

type Data struct {
	Id           uint           `json:"id"`
	Name         string         `json:"name"`
	Productivity []Productivity `json:"productivity"`
}

type Productivity struct {
	Productive   time.Duration
	Unproductive time.Duration
	Neutral      time.Duration
	Idle         time.Duration
	StartTime    time.Time
	EndTime      time.Time
	Working      time.Duration
}

var HeadersForNormalFormat = []string{
	"User Name", "Employee Id", "Date", "Productive Time", "Unproductive Time",
	"Neutral Time", "Idle Time", "Working Time", "Total Time",
}
var HeadersForProductiveTimeFormat = []string{
	"User Name", "Employee Id", "Date", "Productive Time",
}
var HeadersForUnproductiveTimeFormat = []string{
	"User Name", "Employee Id", "Date", "Unproductive Time",
}
var HeadersForNeutralTimeFormat = []string{
	"User Name", "Employee Id", "Date", "Neutral Time",
}

type UserAttendanceForCsv struct {
	UserID       uint `gorm:"column:user_id"`
	Name         string
	EmployeeID   string
	Idle         time.Duration
	Working      time.Duration
	NonWorking   time.Duration
	BreakTime    time.Duration
	TotalTime    time.Duration
	Productive   time.Duration
	Unproductive time.Duration
	Neutral      time.Duration
	StartTime    string `gorm:"column:start_time"`
}
