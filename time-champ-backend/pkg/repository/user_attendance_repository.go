package repository

import (
	"time"

	"github.com/tracker/initializers"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/models"
	"gorm.io/gorm"
)

func (db DbInstance) GetUserAttendance(id uint) (dto.UserAttendance, error) {
	var userAttendance dto.UserAttendance
	err := db.Instance.Model(&dto.UserAttendance{}).Preload("UserActivity").Find(&userAttendance).Error
	return userAttendance, err
}

func (db DbInstance) UpdateUserAttendance(userAttendance dto.UserAttendance) (dto.UserAttendance, *gorm.DB) {
	return userAttendance, db.Instance.Preload("user").Save(&userAttendance)
}

func (db DbInstance) SaveUserAttendance(userAttendance dto.UserAttendance) (dto.UserAttendance, *gorm.DB) {
	return userAttendance, db.Instance.Save(&userAttendance)
}

func (db DbInstance) DeleteUserAttendance(userAttendance models.UserAttendance, id uint) *gorm.DB {
	return db.Instance.Delete(&userAttendance, id)
}

func (db DbInstance) GetUserCurrentDate(user_id uint) (dto.UserAttendance, *gorm.DB) {
	var userAttendance dto.UserAttendance
	err := db.Instance.Where("start_time LIKE ? AND user_id = ?", time.Now().Format(constant.DATE)+"%", user_id).Find(&userAttendance)
	return userAttendance, err
}
func (db DbInstance) GetUserAttendanceDate(user_id uint,date time.Time) (dto.UserAttendance, *gorm.DB) {
	var userAttendance dto.UserAttendance
	err := db.Instance.Where("start_time LIKE ? AND user_id = ?", date.Format(constant.DATE)+"%", user_id).Find(&userAttendance)
	return userAttendance, err
}
func (db DbInstance) GetTotalTimeByUserAttendanceIdAndActivitystatus(id uint, status string) (totalTime uint) {
	result := db.Instance.Table("user_activities").Select("SUM(spent_time)").Where("activity_status = ? AND userAttendance_id = ?", status, id).Row()
	result.Scan(&totalTime)
	return totalTime
}

func (db DbInstance) GetUserAttendanceByDate(userID uint, date string) (dto.UserAttendance, *gorm.DB) {
	var userAttendances dto.UserAttendance
	query := db.Instance.Where("user_id = ? and date(start_time) = ?", userID, date).Find(&userAttendances)
	return userAttendances, query
}

func GetUserAllAttendancesByID(id uint) ([]models.UserAttendance, *gorm.DB) {
	var userAttendances []models.UserAttendance
	return userAttendances, initializers.DB.Where("user_id = ?", id).Find(&userAttendances)
}

func (db DbInstance) GetUserAttendanceProductivity(id uint, weekDates []string) ([]dto.UserAttendance, *gorm.DB) {
	var userAttendanceDto []dto.UserAttendance
	err := db.Instance.Where("user_id = ? and date(start_time) in ?", id, weekDates).
		Find(&userAttendanceDto)
	return userAttendanceDto, err
}

func (db DbInstance) GetUserActivitySummary(userAttendanceID uint) ([]dto.GetUserActivitySummaryDto, error) {
	var userActivitySummary []dto.GetUserActivitySummaryDto
	err := db.Instance.Table("user_activities").
		Select("activity_status AS status, SUM(spent_time) AS counts").
		Where("userAttendance_id = ?", userAttendanceID).
		Group("activity_status").
		Scan(&userActivitySummary).Error
	return userActivitySummary, err
}

func (db DbInstance) GetUserAttendanceReport(userIds []uint, fromDate string, toDate string) ([]dto.UserAttendance, *gorm.DB) {
	var attendances []dto.UserAttendance
	err := db.Instance.Preload("User").Preload("UserActivity").Where("date(start_time) BETWEEN ? AND ? AND user_id IN (?)", fromDate, toDate, userIds).Find(&attendances)
	return attendances, err
}

func (db DbInstance) GetProductivityReportCsv(userIDs []uint, fromDate string, toDate string) ([]dto.UserAttendanceForCsv, *gorm.DB) {
	var csvReport []dto.UserAttendanceForCsv
	err := db.Instance.Table("user_attendances as a").
		Select("u.id as user_id, u.employee_id as empId, u.email as email, u.name as name, a.idle, a.working, a.non_working, a.break_time, a.total_time, a.productive, a.unproductive, a.neutral, a.user_id as att_user_id, a.start_time").
		Joins("right join users as u on u.id = a.user_id").
		Where("u.id IN ?", userIDs).
		Where("DATE(a.start_time) BETWEEN ? AND ?", fromDate, toDate).
		Find(&csvReport)
	return csvReport, err
}
func (db DbInstance) GetLastUserAttendanceData(user_id uint, startTime time.Time) (dto.UserAttendance, *gorm.DB) {
	var userAttendance dto.UserAttendance
	err := db.Instance.Where("start_time LIKE ? AND user_id = ?", startTime.Format(constant.DATE)+"%", user_id).Find(&userAttendance)
	return userAttendance, err
}
