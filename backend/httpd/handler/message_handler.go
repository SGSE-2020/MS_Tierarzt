package handler

import (
	"github.com/couchbase/gocb/v2"
	"github.com/gin-gonic/gin"
	"net/http"
	"tierarzt/couchbase/operations"
	"tierarzt/proto/message"
)

func HandleCreateMessage(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := message.MessageCreate{}
		c.Bind(&requestBody)

		messageData := message.MessageCreate{
			Uid: requestBody.Uid,
			Messagetext: requestBody.Messagetext,
		}

		c.JSON(http.StatusCreated, map[string]string{
			"mid": operations.CreateMessage(db, &messageData),
		})
	}
}

func HandleGetMessage(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		mid := c.Param("mid")

		c.JSON(http.StatusOK, operations.GetMessage(db, &mid))
	}
}

func HandleGetUserMessages(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		userid := c.Param("userid")

		c.JSON(http.StatusAccepted, operations.GetUserMessages(db, &userid))
	}
}

func HandleUpdateMessage(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := message.MessageData{}
		c.Bind(&requestBody)

		mid := c.Param("mid")

		messageData := message.MessageData{
			Mid: mid,
			Uid: requestBody.Uid,
			Messagetext: requestBody.Messagetext,
			Read: requestBody.Read,
		}

		c.JSON(http.StatusAccepted, operations.UpdateMessage(db, &messageData))
	}
}

func HandleDeleteMessage(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		mid := c.Param("mid")

		c.JSON(http.StatusAccepted, operations.DeleteMessage(db, &mid))
	}
}