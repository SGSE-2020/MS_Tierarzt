package couchbase

import (
	//"gopkg.in/couchbase/gocb.v1"
	//"database/sql/driver"
	"fmt"
	"github.com/couchbase/gocb/v2"
	guuid "github.com/google/uuid"
)

// start
func ConnectCouchbase() *gocb.Cluster {
	cluster, err := gocb.Connect(
		"localhost",
		gocb.ClusterOptions{
			Username: "admin",
			Password: "admin1",
		})
	if err != nil {
		panic(err)
	}

	return cluster
}

func GetVetserviceCollection() *gocb.Collection {
	cluster := ConnectCouchbase()
	bucket := cluster.Bucket("vetservice")
	collection := bucket.DefaultCollection()

	return collection
}

func GetUUID() string {
	return fmt.Sprintf("%v", guuid.New())
}

func old() {
	cluster, err := gocb.Connect(
		"localhost",
		gocb.ClusterOptions{
			Username: "admin",
			Password: "admin1",
		})
	if err != nil {
		panic(err)
	}

	bucket := cluster.Bucket("beer-sample")

	collection := bucket.DefaultCollection()

	beer, _ := collection.Get("21st_amendment_brewery_cafe-21a_ipa", nil)

	fmt.Println(beer)

	upsertData := map[string]string{"name": "herforder", "type":"beer"}
	upsertResult, err := collection.Upsert("my-document", upsertData, &gocb.UpsertOptions{})
	if err != nil {
		panic(err)
	}
	fmt.Println(upsertResult.Cas())

	// Get Document
	getResult, err := collection.Get("my-document", &gocb.GetOptions{})
	if err != nil {
		panic(err)
	}

	var myContent interface{}
	if err := getResult.Content(&myContent); err != nil {
		panic(err)
	}
	fmt.Println(myContent)
	//myCluster, _ := gocb.Connect("couchbase://127.0.0.1")
//	myBucket, _ := myCluster.OpenBucket("beer-sample", "")
//
//	var beer map[string]interface{}
//	cas, _ := myBucket.Get("aass_brewery-juleol", &beer)

//	beer["comment"] = "Random beer from Norway"

//	myBucket.Replace("aass_brewery-juleol", &beer, cas, 0)
}