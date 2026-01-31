package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/utkarshkrsingh/goparty/internal/middleware"
)

func HandleRoutes(e *gin.Engine) {
	e.GET("/new-room-code", middleware.RequireAuth, newRoomCode)
	e.POST("/signup", signup)
	e.POST("/login", login)
	e.POST("/logout", logout)
	e.GET("/validate", middleware.RequireAuth, validate)
}
