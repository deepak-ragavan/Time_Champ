package repository

import (
	"time"

	"github.com/tracker/pkg/dto"
	"gorm.io/gorm"
)

func (db DbInstance) SaveScreenshotDetails(screenshotDetails dto.ScreenshotDetails) (dto.ScreenshotDetails, *gorm.DB) {
	return screenshotDetails, db.Instance.Save(&screenshotDetails)
}

func (db DbInstance) GetScreenshotDetailsByDate(userId uint, fromDate time.Time, toDate time.Time) ([]dto.ScreenshotDetails, *gorm.DB) {
	var screenshotDetails []dto.ScreenshotDetails
	err := db.Instance.Where("user_id = ? AND start_time BETWEEN ? AND ? ", userId, fromDate, toDate).Find(&screenshotDetails)
	return screenshotDetails, err
}
