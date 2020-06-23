package handler

import (
	"github.com/couchbase/gocb/v2"
	"github.com/gin-gonic/gin"
	"net/http"
	"tierarzt/couchbase/operations"
	"tierarzt/proto/vetuser"
)

func VetUserPost(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := vetuser.VetUser{}
		c.Bind(&requestBody)

		vetuserData := vetuser.VetUser{
			Uid: requestBody.Uid,
			Gender: requestBody.Gender,
			FirstName: requestBody.FirstName,
			LastName: requestBody.LastName,
			IsEmployee: requestBody.IsEmployee,
		}

		vetuserid := operations.CreateUser(db, &vetuserData)

		c.JSON(http.StatusCreated, map[string]string{
			"uid": vetuserid,
		})
	}
}