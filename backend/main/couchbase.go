package main

import (
	//"gopkg.in/couchbase/gocb.v1"
	//"database/sql/driver"
	"github.com/couchbase/gocb"
)

// start
func main() {
	cluster, err := gocb.Connect(
		"localhost",
		gocb.ClusterOptions{
			Username: "Administrator",
			Password: "password",
		})
	if err != nil {
		panic(err)
	}
	
	myCluster, _ := gocb.Connect("couchbase://127.0.0.1")
	myBucket, _ := myCluster.OpenBucket("beer-sample", "")

	var beer map[string]interface{}
	cas, _ := myBucket.Get("aass_brewery-juleol", &beer)

	beer["comment"] = "Random beer from Norway"

	myBucket.Replace("aass_brewery-juleol", &beer, cas, 0)
}