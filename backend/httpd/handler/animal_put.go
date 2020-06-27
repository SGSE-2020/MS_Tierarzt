package handler

import (
	"github.com/couchbase/gocb/v2"
	"github.com/gin-gonic/gin"
	"net/http"
	"tierarzt/couchbase/operations"
	"tierarzt/proto/animal"
)

func UpdateAnimal(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := animal.AnimalData{}
		c.Bind(&requestBody)

		animalid := c.Param("animalid")

		animalData := animal.AnimalData{
			Animalid: animalid,
			Uid: requestBody.Uid,
			Animalname: requestBody.Animalname,
			Animaltype: requestBody.Animaltype,
			Animalrace: requestBody.Animalrace,
			Animalheight: requestBody.Animalheight,
			Animalweight: requestBody.Animalweight,
			Diseases: requestBody.Diseases,
		}

		updatedAnimalData := operations.UpdateAnimal(db, &animalData)

		c.JSON(http.StatusAccepted, updatedAnimalData)
	}
}