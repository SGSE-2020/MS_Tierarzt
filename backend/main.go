package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"tierarzt/httpd/handler"

	"tierarzt/couchbase"
)

func main() {
	db := couchbase.ConnectCouchbase()

	r := gin.Default()


	api := r.Group("/")
	{
		api.GET("/hello", func(c *gin.Context) {
			c.JSON(http.StatusOK, "content: hello world!")
		})
		api.GET("/animal", handler.AnimalGet(db))
		api.POST("/animal", handler.AnimalPost(db))
		api.GET("/animal/:userid", handler.GetUserAnimals(db))
		api.POST("/user", handler.ValidateUser())
		api.GET("/user/:userid", handler.GetUserData())
		api.GET("/vetuser", handler.VetUserGet(db))
		api.POST("/vetuser", handler.VetUserPost(db))
		api.GET("/vetuser/:userid", handler.VetUserCheck(db))
		api.POST("/appointment", handler.AppointmentPost(db))
		api.GET("/appointment/:userid", handler.GetUserAppointments(db))
	}

	r.Run()
}
