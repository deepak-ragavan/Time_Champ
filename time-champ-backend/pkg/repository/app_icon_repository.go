package repository

import (
	"github.com/tracker/pkg/dto"
	"gorm.io/gorm"
)

func (db DbInstance) GetAppIcon(id uint) (dto.AppIcon, *gorm.DB) {
	var appIcon dto.AppIcon
	return appIcon, db.Instance.First(&appIcon, id)
}

func (db DbInstance) GetAllAppIcon() ([]dto.AppIcon, *gorm.DB) {
	var appIcon []dto.AppIcon
	return appIcon, db.Instance.Find(&appIcon)
}

func (db DbInstance) UpdateAppIcon(AppIcon dto.AppIcon, id uint) (dto.AppIcon, *gorm.DB) {
	return AppIcon, db.Instance.Save(&AppIcon)
}

func (db DbInstance) SaveAppIcon(AppIcon dto.AppIcon) (dto.AppIcon, *gorm.DB) {
	return AppIcon, db.Instance.Save(&AppIcon)
}

func (db DbInstance) DeleteAppIcon(id uint) *gorm.DB {
	return db.Instance.Delete(&dto.AppIcon{}, id)
}

func (db DbInstance) GetAppIconByUserId(userId uint) ([]dto.AppIcon, *gorm.DB) {
	var AppIcon []dto.AppIcon
	return AppIcon, db.Instance.Where("user_id = ?", userId).Find(&AppIcon)
}

func (db DbInstance) SaveAppIcons(appIcons dto.AppIcon) (dto.AppIcon, error) {
	result := db.Instance.Create(&appIcons)
	return appIcons, result.Error
}

func (db DbInstance) GetAllAppIconName() ([]string, error) {
	var appNames []string
	result := db.Instance.Table("app_icons").Pluck("app_name", &appNames)
	return appNames, result.Error
}
