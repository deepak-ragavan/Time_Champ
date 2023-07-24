package models

import (
	"time"

	"gorm.io/gorm"
)

type SystemImage struct {
	gorm.Model
	Name      string    `json:"name"`
	ImageUrl  string    `json:"imageUrl"`
	CreatedAt time.Time `json:"createdAt"`
	UserID    uint      `json:"userId" gorm:"column:user_id"`
	User      User      `json:"user"`
}
