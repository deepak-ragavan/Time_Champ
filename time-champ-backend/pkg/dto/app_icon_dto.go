package dto

import "gorm.io/gorm"

type AppIcon struct {
	gorm.Model
	AppName string `json:"name"`
	AppIcon []byte `json:"appIcon"`
}
