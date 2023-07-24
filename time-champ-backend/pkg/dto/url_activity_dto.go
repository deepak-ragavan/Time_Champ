package dto

import "time"

type UrlActivity struct {
	ID        uint          `json:"id"`
	AppName   string        `json:"appName"`
	UrlName   string        `json:"urlName"`
	StartTime time.Time     `json:"startTime"`
	EndTime   time.Time     `json:"endTime"`
	SpentTime time.Duration `json:"spentTime"`
	UserID    uint          `json:"-"`
	User      User          `json:"user"`
}
