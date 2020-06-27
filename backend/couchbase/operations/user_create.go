package operations

import (
	"github.com/couchbase/gocb/v2"
	"tierarzt/couchbase"
	"tierarzt/proto/vetuser"
)

func CreateUser(db *gocb.Cluster, vetuserData *vetuser.VetUser) string {
	bucket := db.Bucket("vetservice")
	collection := bucket.DefaultCollection()

	query := "SELECT v.* FROM `vetservice` as v " +
		"WHERE v.`isEmployee` IS NOT NULL " +
		"AND v.`uid` == $uid;"
	params := make(map[string]interface{}, 2)
	params["uid"] = vetuserData.Uid

	results, err := db.Query(query,
		&gocb.QueryOptions{NamedParameters: params})
	if err != nil {
		panic(err)
	}

	if results != nil {
		uuid := couchbase.GetUUID()
		_, err = collection.Upsert(uuid, vetuserData, &gocb.UpsertOptions{})
		if err != nil {
			panic(err)
		}
		return vetuserData.Uid
	} else {
		var userData vetuser.VetUser
		err := results.Row(&userData)
		if err != nil {
			panic(err)
		}
		return userData.Uid
	}
}