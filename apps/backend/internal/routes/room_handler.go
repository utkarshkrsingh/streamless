package routes

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/utkarshkrsingh/streamless/internal/db"
	"github.com/utkarshkrsingh/streamless/internal/utils"
)

func newRoomCode(ctx *gin.Context) {
	const maxAttempts = 10
	var roomCode string
	var attemptsLeft = 1
	for ; attemptsLeft <= maxAttempts; attemptsLeft++ {

		var err error
		roomCode, err = utils.GenerateCode()
		if err != nil {
			continue
		}
		var room = db.Rooms{RoomCode: roomCode}
		_, err = room.FindByCode()
		if err != nil {
			ctx.JSON(http.StatusOK, gin.H{
				"roomCode": roomCode,
			})
			return
		}
	}

	if roomCode == "" {
		utils.RespondError(ctx, http.StatusInternalServerError, fmt.Sprintf("Internal Server Error: attempts left - %d", attemptsLeft))
		return
	}
}
