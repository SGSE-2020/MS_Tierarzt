package handler

import (
	"github.com/couchbase/gocb/v2"
	"github.com/gin-gonic/gin"
	"net/http"
	"tierarzt/couchbase/operations"
	"tierarzt/proto/vetuser"
)

func HandleCreateVetUser(db *gocb.Cluster) gin.HandlerFunc {
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

		vetuserid := operations.CreateVetUser(db, &vetuserData)

		c.JSON(http.StatusCreated, map[string]string{
			"vid": vetuserid,
		})
	}
}

func HandleGetAllVetUser(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, operations.GetAllVetUsers(db))
	}
}

func HandleGetAllEmployees(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, operations.GetAllEmployees(db))
	}
}

func HandleGetVetUser(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		userid := c.Param("userid")

		c.JSON(http.StatusAccepted, operations.GetVetUser(db, &userid))
	}
}

func HandleUpdateVetUser(db *gocb.Cluster) gin.HandlerFunc {
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
			Dept: requestBody.Dept,
		}

		updatedData := operations.UpdateVetUser(db, &vetuserData)

		c.JSON(http.StatusAccepted, updatedData)
	}
}

func HandleVetUserDelete(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		userid := c.Param("userid")

		c.JSON(http.StatusAccepted, operations.DeleteVetUser(db, &userid))
	}
}