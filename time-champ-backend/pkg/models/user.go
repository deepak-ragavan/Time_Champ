package models

import (
	"time"

	"github.com/tracker/pkg/enum"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name                string                `json:"name"`
	EmployeeId          string                `json:"employeeId"`
	Email               string                `json:"email" gorm:"unique" binding:"required"`
	Password            string                `json:"password" binding:"required"`
	Role                enum.Role             `json:"role"`
	Branch              enum.Branch           `json:"branch"`
	Department          enum.Department       `json:"department"`
	AccessUuid          string                `json:"accessUuid"`
	RefreshUuid         string                `json:"refreshUuid"`
	DesktopUuid         string                `json:"desktopUuid"`
	PasswordResetToken  string                `json:"passwordResetToken"`
	PasswordResetAt     time.Time             `json:"passwordResetAt"`
	ScreenshotDetails   []ScreenshotDetails   `json:"ScreenshotDetails"`
	TrackerChartDetails []TrackerChartDetails `json:"TrackerChartDetails"`
	UserAttendance      []UserAttendance      `json:"userAttendance" gorm:"ForeignKey:UserID"`
	AppActivity         []AppActivity         `json:"appActivity" gorm:"ForeignKey:UserID"`
	UrlActivity         []UrlActivity         `json:"urlActivity" gorm:"ForeignKey:UserID"`
	ChildUser           []User                `json:"childUser" gorm:"many2many:fk_parent_child_users;joinForeignKey:parent_user_id;joinReferences:child_user_id;"`
	ParentUser          []User                `json:"parentUser" gorm:"many2many:fk_parent_child_users;joinForeignKey:child_user_id;joinReferences:parent_user_id;"`
	Domain              Domain                `json:"domain" gorm:"ForeignKey:DomainID"`
	DomainID            uint                  `json:"domainId"`
	IsDeleted           bool                  `json:"isDeleted"`
	ResetAttempts       int                   `json:"resetAttempts"`
	LastOTPTime         time.Time             `json:"lastOTPTime"`
	OtpVerifed          bool                  `json:"otpVerifed"`
	IsBlocked           bool                  `json:"isBlocked"`
}
