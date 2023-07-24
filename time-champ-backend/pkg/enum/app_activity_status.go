package enum

type AppActivityStatus string

const (
	PRODUCTIVE   AppActivityStatus = "Productive"
	UNPRODUCTIVE AppActivityStatus = "Unproductive"
	NEUTRAL      AppActivityStatus = "Neutral"
)
