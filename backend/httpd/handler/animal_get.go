package handler

import (
	"github.com/couchbase/gocb/v2"
	"github.com/gin-gonic/gin"
	"net/http"
	"tierarzt/couchbase/operations"
)

func AnimalGet(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, operations.GetAllAnimals(db))
	}
}
