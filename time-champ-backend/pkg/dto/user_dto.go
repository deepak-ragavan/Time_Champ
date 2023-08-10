package dto

import (
	"github.com/tracker/pkg/enum"
)

type User struct {
	ID                  uint                   `json:"id"`
	Name                string                 `json:"name"`
	Email               string                 `json:"email" gorm:"unique"`
	Role                enum.Role              `json:"role"`
	Branch              enum.Branch            `json:"branch"`
	Department          enum.Department        `json:"department"`
	ScreenshotDetails   *[]ScreenshotDetails   `json:"ScreenshotDetails"`
	TrackerChartDetails *[]TrackerChartDetails `json:"TrackerChartDetails"`
	UserAttendance      *[]UserAttendance      `json:"userAttendance,omitempty" gorm:"ForeignKey:UserID"`
	AppActivity         *[]AppActivity         `json:"appActivity,omitempty" gorm:"ForeignKey:UserID"`
	UrlActivity         *[]UrlActivity         `json:"urlActivity,omitempty" gorm:"ForeignKey:UserID"`
	ChildUser           []User                 `json:"childUser" gorm:"many2many:fk_parent_child_users;joinForeignKey:parent_user_id;joinReferences:child_user_id;"`
	ParentUser          []User                 `json:"parentUser" gorm:"many2many:fk_parent_child_users;joinForeignKey:child_user_id;joinReferences:parent_user_id;"`
	Domain              Domain                 `json:"domain" gorm:"ForeignKey:DomainID"`
	DomainID            uint                   `json:"-"`
	IsDeleted           bool                   `json:"isDeleted"`
	IsBlocked           bool                   `json:"isBlocked"`
}

type Users struct {
	ID   uint      `json:"id"`
	Name string    `json:"name"`
	Role enum.Role `json:"role"`
}

type ResetPasswordInput struct {
	Email           string `json:"email"`
	Password        string `json:"password" binding:"required"`
	ConfirmPassword string `json:"confirmPassword" binding:"required"`
}
