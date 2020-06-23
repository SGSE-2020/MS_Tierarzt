package operations

import (
	"github.com/couchbase/gocb/v2"
	"tierarzt/couchbase"
	"tierarzt/proto/vetuser"
)

func CreateUser(db *gocb.Cluster, vetuser *vetuser.VetUser) string {
	bucket := db.Bucket("vetservice")
	collection := bucket.DefaultCollection()
	uuid := couchbase.GetUUID()
	_, err := collection.Upsert(uuid, vetuser, &gocb.UpsertOptions{})
	if err != nil {
		panic(err)
	}
	return uuid
}