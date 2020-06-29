package handler

import (
	"github.com/couchbase/gocb/v2"
	"github.com/gin-gonic/gin"
	"net/http"
	"tierarzt/couchbase/operations"
	"tierarzt/proto/animal"
)

func HandleCreateAnimal(db *gocb.Cluster) gin.HandlerFunc {
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

func HandleGetAllAnimals(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, operations.GetAllAnimals(db))
	}
}

func HandleGetAnimal(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		animalid := c.Param("animalid")

		c.JSON(http.StatusOK, operations.GetAnimal(db, &animalid))
	}
}

func HandleGetUserAnimals(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		userid := c.Param("userid")

		c.JSON(http.StatusAccepted, operations.GetUserAnimals(db, &userid))
	}
}

func HandleUpdateAnimal(db *gocb.Cluster) gin.HandlerFunc {
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

func HandleDeleteAnimal(db *gocb.Cluster) gin.HandlerFunc {
	return func(c *gin.Context) {
		animalid := c.Param("animalid")

		c.JSON(http.StatusAccepted, operations.DeleteAnimal(db, &animalid))
	}
}