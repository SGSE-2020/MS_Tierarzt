package handler

import (
	"github.com/couchbase/gocb/v2"
	"github.com/gin-gonic/gin"
	"net/http"
	"tierarzt/couchbase/operations"
)

func HandleCreateRabbitMessage(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		buf := make([]byte, 1024)
		num, _ := c.Request.Body.Read(buf)
		reqBody := string(buf[0:num])

		rabbitid := operations.CreateRabbitMessage(db, reqBody)

		c.JSON(http.StatusCreated, map[string]string{
			"rabbitid": rabbitid,
		})
	}
}

func HandleGetRabbitMq(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, operations.GetRabbitMq(db))
	}
}
