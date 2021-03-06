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
		// RabbitMQ
		api.POST("/rabbitmq", handler.HandleCreateRabbitMessage(db))
		api.GET("/rabbitmq", handler.HandleGetRabbitMq(db))

		// Testcall
		api.GET("/hello", func(c *gin.Context) {
			c.JSON(http.StatusOK, "content: hello world!")
		})

		// Bank
		api.POST("/bank", handler.TransferCost())
		api.GET("/bank/:userid/iban", handler.GetIban())

		// User
		api.POST("/user", handler.ValidateUser())
		api.GET("/user/:userid", handler.GetUserData())

		// Animal
		api.POST("/animal", handler.HandleCreateAnimal(db))
		api.GET("/animal", handler.HandleGetAllAnimals(db))
		api.GET("/animal/:animalid", handler.HandleGetAnimal(db))
		api.PUT("/animal/:animalid", handler.HandleUpdateAnimal(db))
		api.DELETE("/animal/:animalid", handler.HandleDeleteAnimal(db))

		// VetUser
		api.POST("/vetuser", handler.HandleCreateVetUser(db))
		api.GET("/vetuser", handler.HandleGetAllVetUser(db))
		api.GET("/vetuser/:userid", handler.HandleGetVetUser(db))
		api.GET("/vetuser/:userid/animal", handler.HandleGetUserAnimals(db))
		api.GET("/vetuser/:userid/message", handler.HandleGetUserMessages(db))
		api.GET("/vetuser/:userid/appointment", handler.HandleGetUserAppointments(db))
		api.PUT("/vetuser/:userid", handler.HandleUpdateVetUser(db))
		api.DELETE("/vetuser/:userid", handler.HandleVetUserDelete(db))

		// Employee
		api.GET("/employee", handler.HandleGetAllEmployees(db))
		api.GET("/employee/:doctorid/appointment", handler.HandleGetEmployeeAppointments(db))

		// Appointments
		api.POST("/appointment", handler.HandleAppointmentCreate(db))
		api.GET("/appointment/:appointmentid", handler.HandleGetAppointment(db))
		api.DELETE("/appointment/:appointmentid", handler.HandleDeleteAppointment(db))
		api.POST("/appointmentrequest", handler.HandleCreateAppointmentRequest(db))
		api.GET("/appointmentrequest", handler.HandleGetAppointmentRequests(db))
		api.DELETE("/appointmentrequest/:requestid", handler.HandleDeleteAppointmentRequest(db))

		//Messages
		api.POST("/message", handler.HandleCreateMessage(db))
		api.GET("/message/:mid", handler.HandleGetMessage(db))
		api.PUT("/message/:mid", handler.HandleUpdateMessage(db))
		api.DELETE("/message/:mid", handler.HandleDeleteMessage(db))

	}

	r.Run()
}
