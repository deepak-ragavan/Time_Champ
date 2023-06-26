package repository

import (
	"github.com/tracker/initializers"
	"github.com/tracker/pkg/models"
	"gorm.io/gorm"
)

func GetUser(id int) (models.User, *gorm.DB) {
	var user models.User
	return user, initializers.DB.First(&user, id)
}

func UpdateUser(user models.User, id int) (models.User, *gorm.DB) {
	return user, initializers.DB.Save(&user)
}

func SaveUser(user models.User, id int) (models.User, *gorm.DB) {
	return user, initializers.DB.Save(&user)
}

func DeleteUser(user models.User, id int) (models.User, *gorm.DB) {
	return user, initializers.DB.Delete(&user, id)
}
