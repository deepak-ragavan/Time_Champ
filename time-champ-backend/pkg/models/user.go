package models

import (
	"time"

	"github.com/tracker/pkg/enum"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name               string           `json:"name"`
	EmployeeId         string           `json:"employeeId"`
	Email              string           `json:"email" gorm:"unique" binding:"required"`
	Password           string           `json:"password" binding:"required"`
	Role               enum.Role        `json:"role"`
	Branch             string           `json:"branch"`
	Department         string           `json:"department"`
	AccessUuid         string           `json:"accessUuid"`
	RefreshUuid        string           `json:"refreshUuid"`
	PasswordResetToken string           `json:"passwordResetToken"`
	PasswordResetAt    time.Time        `json:"passwordResetAt"`
	UserAttendance     []UserAttendance `json:"userAttendance" gorm:"ForeignKey:UserID"`
	SystemImage        []SystemImage    `json:"systemImage" gorm:"ForeignKey:UserID"`
	AppActivity        []AppActivity    `json:"appActivity" gorm:"ForeignKey:UserID"`
	UrlActivity        []UrlActivity    `json:"urlActivity" gorm:"ForeignKey:UserID"`
	ChildUser          []User           `json:"childUser" gorm:"many2many:fk_parent_child_users;joinForeignKey:parent_user_id;joinReferences:child_user_id;"`
	ParentUser         []User           `json:"parentUser" gorm:"many2many:fk_parent_child_users;joinForeignKey:child_user_id;joinReferences:parent_user_id;"`
	Domain             Domain           `json:"domain" gorm:"ForeignKey:DomainID"`
	DomainID           uint             `json:"domainId"`
	IsDeleted          bool
}
