package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/enum"
	"github.com/tracker/security/authentication"
	authenticationwithgoogle "github.com/tracker/security/authenticationWithGoogle"
	forgetpassword "github.com/tracker/security/forgetPassword"
)

func AuthenticationController(r *gin.Engine) {
	r.POST("/signup", authentication.Signup)
	r.POST("/login", authentication.Login)
	r.POST("/logout", authentication.Logout)
	r.POST("/refresh", authentication.Refresh)
	r.GET("/", gin.WrapF(authenticationwithgoogle.HandleMain))
	r.GET("/login-gl", gin.WrapF(authenticationwithgoogle.HandleGoogleLogin))
	r.GET("/callback-gl", gin.WrapF(authenticationwithgoogle.CallBackFromGoogle))
	r.POST("/forgotpassword", forgetpassword.ForgotPassword)
	r.POST("/updatepassword", middleware.RequireAuth, middleware.Authorization(enum.USER), forgetpassword.UpdatePassword)
	r.PATCH("/resetpassword", forgetpassword.ResetPassword)
}
