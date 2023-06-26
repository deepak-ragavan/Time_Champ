package repository

import (
	"github.com/tracker/initializers"
	"github.com/tracker/pkg/models"
	"gorm.io/gorm"
)

func GetSystemImageId(id int) (models.SystemImage, *gorm.DB) {
	var systemImage models.SystemImage
	return systemImage, initializers.DB.First(&systemImage, id)
}

func UpdateSystemImage(systemImage models.SystemImage, id int) (models.SystemImage, *gorm.DB) {
	return systemImage, initializers.DB.Save(&systemImage)
}

func SaveSystemImage(systemImage models.SystemImage) (models.SystemImage, *gorm.DB) {
	return systemImage, initializers.DB.Save(&systemImage)
}

func DeleteSystemImage(systemImage models.SystemImage, id int) (models.SystemImage, *gorm.DB) {
	return systemImage, initializers.DB.Delete(&systemImage, id)
}
func GetAllSystemImageByID(id int) ([]models.SystemImage, *gorm.DB) {
	var systemImage []models.SystemImage
	return systemImage, initializers.DB.Where("user_id = ?", id).Find(&systemImage)
}
func GetSystemImagesByDate(userID int, date string) ([]models.SystemImage, *gorm.DB) {
	var systemImage []models.SystemImage
	query := initializers.DB.Where("created_at LIKE ?", date+"%").Find(&systemImage)
	return systemImage, query
}
func DeletePreviousMonthRecords(PreviousMonthDate string) *gorm.DB {
	result := initializers.DB.Delete(&models.SystemImage{}, "created_at < ?", PreviousMonthDate)
	return result
}
