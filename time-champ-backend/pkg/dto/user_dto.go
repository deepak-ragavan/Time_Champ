package dto

import "github.com/tracker/pkg/enum"

type UserDto struct {
	ID             int
	Name           string
	Email          string `gorm:"unique"`
	Password       string
	Role           enum.Role
	UserAttendance []UserAttendanceDto
}
