package dto

type TokenDetails struct {
	AccessToken  string
	RefreshToken string
	AccessUuid   string
	RefreshUuid  string
	DesktopUuid  string
	AtExpires    int64
	RtExpires    int64
}
