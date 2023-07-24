package dto

import (
	"github.com/tracker/pkg/enum"
)

type User struct {
	ID             uint             `json:"id"`
	Name           string           `json:"name"`
	Email          string           `json:"email" gorm:"unique"`
	Role           enum.Role        `json:"role"`
	Branch         string           `json:"branch"`
	Department     string           `json:"department"`
	UserAttendance []UserAttendance `json:"userAttendance" gorm:"ForeignKey:UserID"`
	SystemImage    []SystemImage    `json:"systemImage" gorm:"ForeignKey:UserID"`
	AppActivity    []AppActivity    `json:"appActivity" gorm:"ForeignKey:UserID"`
	UrlActivity    []UrlActivity    `json:"urlActivity" gorm:"ForeignKey:UserID"`
	ChildUser      []User           `json:"childUser" gorm:"many2many:fk_parent_child_users;joinForeignKey:parent_user_id;joinReferences:child_user_id;"`
	ParentUser     []User           `json:"parentUser" gorm:"many2many:fk_parent_child_users;joinForeignKey:child_user_id;joinReferences:parent_user_id;"`
	Domain         Domain           `json:"domain" gorm:"ForeignKey:DomainID"`
	DomainID       uint             `json:"-"`
}

type Users struct {
	ID   uint      `json:"id"`
	Name string    `json:"name"`
	Role enum.Role `json:"role"`
}
