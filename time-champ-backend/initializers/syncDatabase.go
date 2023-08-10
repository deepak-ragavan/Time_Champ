package initializers

import "github.com/tracker/pkg/models"

func SyncDatabase() {
	DB.AutoMigrate(&models.User{}, &models.UserAttendance{}, &models.UserActivity{}, models.ScreenshotDetails{}, models.TrackerChartDetails{},
		&models.AppActivity{}, &models.Domain{}, &models.AppIcon{})
}
