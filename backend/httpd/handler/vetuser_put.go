package handler

import (
	"github.com/couchbase/gocb/v2"
	"github.com/gin-gonic/gin"
	"net/http"
	"tierarzt/couchbase/operations"
	"tierarzt/proto/vetuser"
)

func UpdateVetUser(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := vetuser.VetUser{}
		c.Bind(&requestBody)

		userid := c.Param("userid")

		vetuserData := vetuser.VetUser{
			Uid: userid,
			Gender: requestBody.Gender,
			FirstName: requestBody.FirstName,
			LastName: requestBody.LastName,
			IsEmployee: requestBody.IsEmployee,
		}

		updatedAnimalData := operations.UpdateVetUser(db, &vetuserData)

		c.JSON(http.StatusAccepted, updatedAnimalData)
	}
}