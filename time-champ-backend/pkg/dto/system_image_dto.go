package dto

import "time"

type SystemImage struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	ImageUrl  string    `json:"imageUrl"`
	CreatedAt time.Time `json:"createdAt"`
	UserID    uint      `json:"-" gorm:"column:user_id"`
	User      User      `json:"user"`
}
