package main

import (
	"github.com/gin-gonic/gin"
	"tierarzt/couchbase"
	"tierarzt/httpd/handler"
) 

func main() {
	db := couchbase.ConnectCouchbase()
	/*allAnimalData := []animal.AnimalData{}
	allAnimalData = append(allAnimalData,
		animal.AnimalData{
			Animalid:     "1",
			Animalname:   "Amy",
			Animaltype:   "Hund",
			Animalrace:   "Border-Collie",
			Animalweight: 15.6,
			Animalheight: 42.0,
		})
	allAnimalData = append(allAnimalData,
		animal.AnimalData{
			Animalid:     "2",
			Animalname:   "Fee",
			Animaltype:   "Katze",
			Animalrace:   "Hauskatze",
			Animalweight: 6.8,
			Animalheight: 22.4,
		})

	id := 3*/

	r := gin.Default()

	api := r.Group("/api")
	{
		/*// Placeholder
		api.GET("/animal", func(c *gin.Context) {
			c.JSON(http.StatusOK, allAnimalData)
		})
		api.POST("/animal", func(c *gin.Context) {
			requestBody := animal.AnimalData{}
			c.Bind(&requestBody)

			animalid := strconv.Itoa(id)
			id = id + 1

			animalData := animal.AnimalData{
				Animalid: animalid,
				Animalname: requestBody.Animalname,
				Animaltype: requestBody.Animaltype,
				Animalrace: requestBody.Animalrace,
				Animalheight: requestBody.Animalheight,
				Animalweight: requestBody.Animalweight,
			}

			allAnimalData = append(allAnimalData, animalData)

			c.JSON(http.StatusCreated, map[string]string{
				"uid": animalid,
			})
		})*/

		api.GET("/animal", handler.AnimalGet(db))
		api.POST("/animal", handler.AnimalPost(db))
	}

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
