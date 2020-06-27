package handler

import (
	"github.com/couchbase/gocb/v2"
	"github.com/gin-gonic/gin"
	"net/http"
	"tierarzt/couchbase/operations"
)

func VetUserDelete(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		userid := c.Param("userid")

		c.JSON(http.StatusAccepted, operations.DeleteUser(db, &userid))
	}
}