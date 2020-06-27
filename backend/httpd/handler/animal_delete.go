package handler

import (
	"github.com/couchbase/gocb/v2"
	"github.com/gin-gonic/gin"
	"net/http"
	"tierarzt/couchbase/operations"
)

func DeleteAnimal(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		animalid := c.Param("animalid")

		c.JSON(http.StatusAccepted, operations.DeleteAnimal(db, &animalid))
	}
}