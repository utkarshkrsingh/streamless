// Package db stores room-code and data about number of active members in a room
package db

import (
	"time"

	"github.com/utkarshkrsingh/streamless/internal/initializer"
)

type Rooms struct {
	ID        string    `db:"id" json:"id"`
	RoomCode  string    `db:"room_code" json:"roomCode"`
	HostID    string    `db:"host_id" json:"hostId"`
	IsActive  bool      `db:"is_active" json:"isActive"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
}

func (r *Rooms) FindByCode() (*Rooms, error) {
	var room Rooms
	query := `SELECT * FROM rooms WHERE room_code = $1`
	if err := initializer.DB.Get(&room, query, r.RoomCode); err != nil {
		return nil, err
	}
	return &room, nil
}
