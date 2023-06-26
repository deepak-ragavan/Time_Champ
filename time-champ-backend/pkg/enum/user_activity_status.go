package enum

type UserActivityStatus string

const (
	Activity_OFFLINE UserActivityStatus = "offline"
	Activity_WORKING UserActivityStatus = "working"
	Activity_BREAK   UserActivityStatus = "break"
	Activity_IDLE    UserActivityStatus = "idle"
	Activity_FINISH  UserActivityStatus = "finish"
)
