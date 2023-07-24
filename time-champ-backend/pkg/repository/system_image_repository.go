package repository

import (
	"github.com/tracker/pkg/dto"
	"gorm.io/gorm"
)

func (db DbInstance) GetSystemImageId(id uint) (dto.SystemImage, *gorm.DB) {
	var systemImage dto.SystemImage
	return systemImage, db.Instance.First(&systemImage, id)
}

func (db DbInstance) UpdateSystemImage(systemImage dto.SystemImage, id uint) (dto.SystemImage, *gorm.DB) {
	return systemImage, db.Instance.Save(&systemImage)
}

func (db DbInstance) SaveSystemImage(systemImage dto.SystemImage) (dto.SystemImage, *gorm.DB) {
	return systemImage, db.Instance.Save(&systemImage)
}

func (db DbInstance) DeleteSystemImage(systemImage dto.SystemImage, id uint) (dto.SystemImage, *gorm.DB) {
	return systemImage, db.Instance.Delete(&systemImage, id)
}

func (db DbInstance) GetAllSystemImageByID(id uint) ([]dto.SystemImage, *gorm.DB) {
	var systemImage []dto.SystemImage
	return systemImage, db.Instance.Where("user_id = ?", id).Find(&systemImage)
}

func (db DbInstance) GetSystemImagesByDate(userID uint, formDate string, toDate string) ([]dto.SystemImage, *gorm.DB) {
	var systemImage []dto.SystemImage
	err := db.Instance.Where("user_id = ? and date(created_at) between ? and ?", userID, formDate, toDate).
		Find(&systemImage)
	return systemImage, err
}

func (db DbInstance) DeletePreviousMonthRecords(PreviousMonthDate string) *gorm.DB {
	result := db.Instance.Delete(&dto.SystemImage{}, "created_at < ?", PreviousMonthDate)
	return result
}
