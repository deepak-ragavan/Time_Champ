package initializers

import "github.com/tracker/pkg/models"

func SyncDatabase() {
	DB.AutoMigrate(&models.User{}, &models.UserAttendance{}, &models.UserActivity{}, &models.SystemImage{},
		&models.AppActivity{}, &models.Domain{})
}
