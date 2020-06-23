package handler

import (
	"github.com/couchbase/gocb/v2"
	"github.com/gin-gonic/gin"
	"net/http"
	"tierarzt/couchbase/operations"
	"tierarzt/proto/appointment"
)

func AppointmentPost(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := appointment.AppointmentCreate{}
		c.Bind(&requestBody)

		appointmentData := appointment.AppointmentCreate{
			Uid: requestBody.Uid,
			Date: requestBody.Date,
			Duration: requestBody.Duration,
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