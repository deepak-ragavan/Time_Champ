package enum

type UserActivityStatus string

const (
	Activity_OFFLINE UserActivityStatus = "Offline"
	Activity_WORKING UserActivityStatus = "Working"
	Activity_BREAK   UserActivityStatus = "Break"
	Activity_IDLE    UserActivityStatus = "Idle"
	Activity_FINISH  UserActivityStatus = "Finish"
	IDLE_BREAK       UserActivityStatus = "Idle(Break)"
)
