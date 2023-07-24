package repository

import (
	"github.com/tracker/pkg/dto"
	"gorm.io/gorm"
)

func (db DbInstance) GetUrlActivity(id uint) (dto.UrlActivity, *gorm.DB) {
	var urlActivity dto.UrlActivity
	return urlActivity, db.Instance.First(&urlActivity, id)
}

func (db DbInstance) UpdateUrlActivity(urlActivity dto.UrlActivity, id uint) (dto.UrlActivity, *gorm.DB) {
	return urlActivity, db.Instance.Save(&urlActivity)
}

func (db DbInstance) SaveUrlActivity(urlActivity dto.UrlActivity) (dto.UrlActivity, *gorm.DB) {
	return urlActivity, db.Instance.Save(&urlActivity)
}

func (db DbInstance) DeleteUrlActivity(id uint) *gorm.DB {
	return db.Instance.Delete(&dto.UrlActivity{}, id)
}

func (db DbInstance) GetUrlActivityByUserId(userId uint) ([]dto.UrlActivity, *gorm.DB) {
	var urlActivity []dto.UrlActivity
	return urlActivity, db.Instance.Where("user_id = ?", userId).Find(&urlActivity)
}
