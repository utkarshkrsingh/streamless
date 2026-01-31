package db

type Hashes struct {
	ID       string `db:"id" json:"id"`
	RoomCode string `db:"room_code" json:"roomCode"`
	FileHash string `db:"file_hash" json:"fileHash"`
}
