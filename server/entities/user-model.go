package entities

import "time"

type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"not null" binding:"required,min=3"`
	LastName  string    `json:"last_name" gorm:"not null" binding:"required,min=3"`
	Username  string    `json:"username" gorm:"not null;unique" binding:"required,min=3"`
	Pass      string    `json:"pass" gorm:"not null" binding:"required,min=3,max=100"`
	Role      string    `json:"role" gorm:"not null;default:'user'"` // Default role is 'user'
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
	Reports   []Report  `json:"reports" gorm:"foreignKey:UserID"`
}
