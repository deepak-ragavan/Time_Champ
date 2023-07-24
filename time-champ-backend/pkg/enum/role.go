package enum

type Role string

var Permission = []string{"Super-Admin", "Admin", "Manager", "Team-Lead", "User"}

const (
	SUPER_ADMIN Role = "Super-Admin"
	ADMIN       Role = "Admin"
	MANAGER     Role = "Manager"
	TEAM_LEAD   Role = "Team-Lead"
	USER        Role = "User"
)
