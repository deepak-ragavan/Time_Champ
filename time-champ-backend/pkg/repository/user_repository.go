package repository

import (
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/enum"
	"github.com/tracker/pkg/models"
	"gorm.io/gorm"
)

func (db DbInstance) GetUser(id uint) (models.User, *gorm.DB) {
	var user models.User
	return user, db.Instance.First(&user, id)
}

func (db DbInstance) GetChildUser(id uint) (dto.User, *gorm.DB) {
	var user dto.User
	return user, db.Instance.Preload("ChildUser").Preload("ChildUser").Find(&user, id)
}

func (db DbInstance) UpdateUser(user models.User, id uint) (models.User, *gorm.DB) {
	return user, db.Instance.Save(&user)
}

func (db DbInstance) SaveUser(user models.User) (models.User, *gorm.DB) {
	return user, db.Instance.Save(&user)
}

func (db DbInstance) DeleteUser(user models.User, id uint) *gorm.DB {
	return db.Instance.Delete(&user, id)
}

func (db DbInstance) GetByMailId(mail string) (models.User, *gorm.DB) {
	var User models.User
	return User, db.Instance.Where("email = ? ", mail).First(&User)
}
func (db DbInstance) GetUserDetailsForSummaryReport() ([]dto.User, *gorm.DB) {
	var results []dto.User
	err := db.Instance.Where("role NOT LIKE ?", enum.SUPER_ADMIN).Select("id, name, email").Find(&results)
	return results, err
}
