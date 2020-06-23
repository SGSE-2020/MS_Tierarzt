package handler

import (
	"github.com/couchbase/gocb/v2"
	"github.com/gin-gonic/gin"
	"net/http"
	"tierarzt/couchbase/operations"
	"tierarzt/proto/animal"
)

func AnimalPost(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := animal.AnimalData{}
		c.Bind(&requestBody)

		animalData := animal.AnimalData{
			Uid: requestBody.Uid,
			Animalname: requestBody.Animalname,
			Animaltype: requestBody.Animaltype,
			Animalrace: requestBody.Animalrace,
			Animalheight: requestBody.Animalheight,
			Animalweight: requestBody.Animalweight,
			Diseases: requestBody.Diseases,
		}

		animalid := operations.CreateAnimal(db, &animalData)

		c.JSON(http.StatusCreated, map[string]string{
			"uid": animalid,
		})
	}
}