package dto

import "time"

type SystemImageDto struct {
	ID     int
	Name   string
	S3Url  string
	Date   time.Time
	UserID int 
}
