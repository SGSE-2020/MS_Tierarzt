package main

import (
	"github.com/gin-gonic/gin"
	"tierarzt/couchbase"
	"tierarzt/httpd/handler"
)

func main() {
	db := couchbase.ConnectCouchbase()

	r := gin.Default()

	r.GET("/animal", handler.AnimalGet(db))
	r.POST("/animal", handler.AnimalPost(db))

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
