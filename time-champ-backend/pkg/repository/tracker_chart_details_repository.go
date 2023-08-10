package repository

import (
	"time"

	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/dto"
	"gorm.io/gorm"
)

func (db DbInstance) GetTrackerChartDetails(id uint, time time.Time) (dto.TrackerChartDetails, *gorm.DB) {
	var trackerChartDetails dto.TrackerChartDetails
	return trackerChartDetails, db.Instance.Where("user_id = ? AND date(start_time) = ?", id, time.Format(constant.DATE)).First(&trackerChartDetails)
}

func (db DbInstance) SaveTrackerChartDetails(trackerChartDetails dto.TrackerChartDetails) (dto.TrackerChartDetails, *gorm.DB) {
	return trackerChartDetails, db.Instance.Save(&trackerChartDetails)
}

func (db DbInstance) GetLastTrackerChartDetails(userId uint, start time.Time, end time.Time) (dto.TrackerChartDetails, *gorm.DB) {
	var trackerChartDetails dto.TrackerChartDetails
	err := db.Instance.Where("user_id = ? AND end_time = ? AND start_time between ? and ?", userId, constant.DATE_TIME, start, end).Last(&trackerChartDetails)
	return trackerChartDetails, err
}

func (db DbInstance) GetTrackerChartDetailsReportByDate(userId uint, fromDate time.Time, toDate time.Time) ([]dto.TrackerChartDetails, *gorm.DB) {
	var trackerChartDetails []dto.TrackerChartDetails
	err := db.Instance.Where("user_id = ? AND start_time BETWEEN ? AND ? ", userId, fromDate, toDate).Find(&trackerChartDetails)
	return trackerChartDetails, err
}
