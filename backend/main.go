package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"tierarzt/httpd/handler"

	"tierarzt/couchbase"
)

func main() {
	db := couchbase.ConnectCouchbase()

	r := gin.Default()

	api := r.Group("/api")
	{
		api.GET("/hello", func(c *gin.Context) {
			c.JSON(http.StatusOK, "content: hello world!")
		})
		api.GET("/animal", handler.AnimalGet(db))
		api.POST("/animal", handler.AnimalPost(db))
		api.POST("/user", handler.ValidateUser())
	}

	r.Run()
}
