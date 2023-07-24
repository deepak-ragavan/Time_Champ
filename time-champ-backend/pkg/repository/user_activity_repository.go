package repository

import (
	"github.com/tracker/pkg/models"
	"gorm.io/gorm"
)

func (db DbInstance) GetUserActivity(id uint) (models.UserActivity, *gorm.DB) {
	var userActivity models.UserActivity
	return userActivity, db.Instance.Preload("userAttendance").First(&userActivity, id)
}

func (db DbInstance) UpdateUserActivity(userActivity models.UserActivity, id uint) *gorm.DB {
	return db.Instance.Save(&userActivity)
}

func (db DbInstance) SaveUserActivity(userActivity models.UserActivity) (models.UserActivity, *gorm.DB) {
	return userActivity, db.Instance.Save(&userActivity)
}

func (db DbInstance) DeleteUserActivity(userActivity models.UserActivity, id uint) *gorm.DB {
	return db.Instance.Delete(&userActivity, id)
}

func (db DbInstance) GetUserActivityByUserAttendanceIDAndDate(id uint, date string) (models.UserActivity, *gorm.DB) {
	var userActivity models.UserActivity
	err := db.Instance.Where("userAttendance_id = ? AND end_time = ?", id, date).First(&userActivity)
	return userActivity, err
}

func (db DbInstance) GetUserActivityByMaxDate(id uint) (models.UserActivity, *gorm.DB) {
	var userActivity models.UserActivity
	err := db.Instance.Where("userAttendance_id = ?", id).Order("end_time desc").First(&userActivity)
	return userActivity, err
}
