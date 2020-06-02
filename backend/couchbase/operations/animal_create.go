package operations

import (
	"github.com/couchbase/gocb/v2"
	"tierarzt/couchbase"
	"tierarzt/proto/animal"
)

func CreateAnimal(db *gocb.Cluster, animalCreation *animal.AnimalCreation) string {
	bucket := db.Bucket("vetservice")
	collection := bucket.DefaultCollection()
	uuid := couchbase.GetUUID()
	_, err := collection.Upsert(uuid, animalCreation, &gocb.UpsertOptions{})
	if err != nil {
		panic(err)
	}
	return uuid
}
