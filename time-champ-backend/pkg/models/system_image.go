package models

import "time"

type SystemImage struct {
	ID        int `gorm:"primary_key, AUTO_INCREMENT"`
	Name      string
	ImageUrl  string
	CreatedAt time.Time
	UserID    int `gorm:"column:user_id"`
}
