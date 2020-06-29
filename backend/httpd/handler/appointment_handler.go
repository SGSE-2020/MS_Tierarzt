package handler

import (
	"github.com/couchbase/gocb/v2"
	"github.com/gin-gonic/gin"
	"net/http"
	"tierarzt/couchbase/operations"
	"tierarzt/proto/appointment"
)

func HandleAppointmentCreate(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := appointment.AppointmentCreate{}
		c.Bind(&requestBody)

		appointmentData := appointment.AppointmentCreate{
			Uid: requestBody.Uid,
			Start: requestBody.Start,
			End: requestBody.End,
			Animalid: requestBody.Animalid,
			Cost: requestBody.Cost,
			Reason: requestBody.Reason,
		}

		appointmentid := operations.CreateAppointment(db, &appointmentData)

		c.JSON(http.StatusCreated, map[string]string{
			"appointmentId": appointmentid,
		})
	}
}

func HandleCreateAppointmentRequest(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := appointment.AppointmentRequest{}
		c.Bind(&requestBody)

		appointmentData := appointment.AppointmentRequest{
			Uid: requestBody.Uid,
			Start: requestBody.Start,
			End: requestBody.End,
			Animalid: requestBody.Animalid,
			Reason: requestBody.Reason,
		}

		appointmentid := operations.CreateAppointmentRequest(db, &appointmentData)

		c.JSON(http.StatusCreated, map[string]string{
			"appointmentId": appointmentid,
		})
	}
}

func HandleGetAppointment(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		appointmentid := c.Param("appointmentid")
		c.JSON(http.StatusAccepted, operations.GetAppointment(db, &appointmentid))
	}
}

func HandleGetAppointmentRequests(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusAccepted, operations.GetAppointmentRequests(db))
	}
}

func HandleGetUserAppointments(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		userid := c.Param("userid")

		c.JSON(http.StatusAccepted, operations.GetUserAppointments(db, &userid))
	}
}

func HandleDeleteAppointmentRequest(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestid := c.Param("requestid")

		c.JSON(http.StatusAccepted, operations.DeleteAppointmentRequest(db, &requestid))
	}
}