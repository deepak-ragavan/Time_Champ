package repository

import (
	"time"

	"github.com/tracker/initializers"
	"github.com/tracker/pkg/enum"
	"github.com/tracker/pkg/models"
	"gorm.io/gorm"
)

func GetUserAttendance(id int) (models.UserAttendance, error) {
	var userAttendance models.UserAttendance
	err := initializers.DB.Model(&models.UserAttendance{}).Preload("UserActivity").Find(&userAttendance).Error
	return userAttendance, err
}

func UpdateUserAttendance(userAttendance models.UserAttendance, id int) (models.UserAttendance, *gorm.DB) {
	return userAttendance, initializers.DB.Save(&userAttendance)
}

func SaveUserAttendance(userAttendance models.UserAttendance) (models.UserAttendance, *gorm.DB) {
	return userAttendance, initializers.DB.Save(&userAttendance)
}

func DeleteUserAttendance(userAttendance models.UserAttendance, id int) *gorm.DB {
	return initializers.DB.Delete(&userAttendance, id)
}
func GetUserCurrentDtae(user_id int) (models.UserAttendance, *gorm.DB) {
	var userAttendance models.UserAttendance
	err := initializers.DB.Where("start_time LIKE ? AND user_id = ?", time.Now().Format(enum.DATE)+"%", user_id).Find(&userAttendance)
	return userAttendance, err
}
func GetTotalSpentTimeForBreakByUserAttendanceID(id int, status string) (totalTime int, err error) {
	result := initializers.DB.Table("user_activities").Select("SUM(spent_time)").Where("activity_status = ? AND userAttendance_id = ?", status, id).Row()
	result.Scan(&totalTime)
	return totalTime, nil
}
func GetUserAttendanceByDate(userID int, date string) (models.UserAttendance, *gorm.DB) {
	var userAttendances models.UserAttendance
	query := initializers.DB.Where("start_time LIKE ?", date+"%").Find(&userAttendances)
	return userAttendances, query
}
func GetUserAllAttendancesByID(id int) ([]models.UserAttendance, *gorm.DB) {
	var userAttendances []models.UserAttendance
	return userAttendances, initializers.DB.Where("user_id = ?", id).Find(&userAttendances)
}
