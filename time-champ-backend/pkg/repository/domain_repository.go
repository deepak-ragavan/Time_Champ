package repository

import (
	"github.com/tracker/pkg/models"
	"gorm.io/gorm"
)

func (db DbInstance) GetDomain(id uint) (models.Domain, *gorm.DB) {
	var domain models.Domain
	return domain, db.Instance.First(&domain, id)
}

func (db DbInstance) UpdateDomain(domain models.Domain, id uint) (models.Domain, *gorm.DB) {
	return domain, db.Instance.Save(&domain)
}

func (db DbInstance) SaveDomain(domain models.Domain) (models.Domain, *gorm.DB) {
	return domain, db.Instance.Save(&domain)
}

func (db DbInstance) DeleteDomain(domain models.Domain, id uint) *gorm.DB {
	return db.Instance.Delete(&domain, id)
}
func (db DbInstance) GetDomainByName(domainName string) (models.Domain, *gorm.DB) {
	var domain models.Domain
	return domain, db.Instance.First(&domain, "domain_name = ?", domainName)
}
