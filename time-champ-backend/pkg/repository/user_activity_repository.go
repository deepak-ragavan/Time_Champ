package repository

import (
	"time"

	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/dto"
	"gorm.io/gorm"
)

func (db DbInstance) GetUserActivity(id uint) (dto.UserActivity, *gorm.DB) {
	var userActivity dto.UserActivity
	return userActivity, db.Instance.Preload("userAttendance").First(&userActivity, id)
}

func (db DbInstance) SaveUserActivity(userActivity dto.UserActivity) (dto.UserActivity, *gorm.DB) {
	return userActivity, db.Instance.Save(&userActivity)
}

func (db DbInstance) DeleteUserActivity(userActivity dto.UserActivity, id uint) *gorm.DB {
	return db.Instance.Delete(&userActivity, id)
}

func (db DbInstance) GetUserActivityByUserAttendanceIDAndDate(id uint, date string) (dto.UserActivity, *gorm.DB) {
	var userActivity dto.UserActivity
	err := db.Instance.Where("userAttendance_id = ? AND end_time = ?", id, date).First(&userActivity)
	return userActivity, err
}

func (db DbInstance) GetUserActivityByMaxDate(id uint) (dto.UserActivity, *gorm.DB) {
	var userActivity dto.UserActivity
	err := db.Instance.Where("userAttendance_id = ?", id).Order("end_time desc").First(&userActivity)
	return userActivity, err
}

func (db DbInstance) UpdateUserActivity(from time.Time, to time.Time) ([]dto.UserActivity, error) {
	var userActivities []dto.UserActivity
	var activity = []string{"Break", "Idle", "Working"}
	err := db.Instance.
		Where("start_time BETWEEN ? AND ? AND (activity_status IN (?) AND end_time = ?)",
			from, to, activity, constant.DATE_TIME).
		Find(&userActivities).
		Error
	return userActivities, err
}
