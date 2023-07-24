package repository

import (
	"github.com/tracker/initializers"
	"gorm.io/gorm"
)

type DbInstance struct {
	Instance *gorm.DB
}

func TX() DbInstance {
	return DbInstance{Instance: initializers.DB.Begin()}
}
func DB() DbInstance {
	return DbInstance{Instance: initializers.DB}
}
