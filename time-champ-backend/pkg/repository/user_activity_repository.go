package repository

import (
	"github.com/tracker/initializers"
	"github.com/tracker/pkg/models"
	"gorm.io/gorm"
)

func GetUserActivity(id int) (models.UserActivity, error) {
	var userActivity models.UserActivity
	err := initializers.DB.Model(&models.UserActivity{}).Preload("UserAttendance").Find(&userActivity).Error
	return userActivity, err
}

func UpdateUserActivity(userActivity models.UserActivity, id int) *gorm.DB {
	return initializers.DB.Save(&userActivity)
}

func SaveUserActivity(userActivity models.UserActivity) (models.UserActivity, *gorm.DB) {
	return userActivity, initializers.DB.Save(&userActivity)
}

func DeleteUserActivity(userActivity models.UserActivity, id int) *gorm.DB {
	return initializers.DB.Delete(&userActivity, id)
}

func GetUserActivityByUserAttendanceIDAndDate(id int, date string) (models.UserActivity, *gorm.DB) {
	var userActivity models.UserActivity
	err := initializers.DB.Where("userAttendance_id = ? AND end_time = ?", id, date).First(&userActivity)
	return userActivity, err
}

func GetUserActivityByMaxDate(id int) (models.UserActivity, *gorm.DB) {
	var userActivity models.UserActivity
	err := initializers.DB.Where("userAttendance_id = ?", id).Order("end_time desc").First(&userActivity)
	return userActivity, err
}
