package models

import (
	"time"

	"github.com/tracker/pkg/enum"
)

type User struct {
	ID                 int `gorm:"primary_key, AUTO_INCREMENT"`
	Name               string
	Email              string `gorm:"unique"`
	Password           string
	Role               enum.Role
	AccessUuid         string
	RefreshUuid        string
	PasswordResetToken string
	PasswordResetAt    time.Time
	UserAttendance     []UserAttendance `gorm:"ForeignKey:UserID"`
	SystemImage        []SystemImage    `gorm:"ForeignKey:UserID"`
}
