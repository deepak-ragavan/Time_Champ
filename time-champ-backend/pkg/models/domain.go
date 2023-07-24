package models

import "gorm.io/gorm"

type Domain struct {
	gorm.Model
	DomainName string `json:"domainName"`
	Password   string `json:"password"`
	IsDeleted         bool
}
