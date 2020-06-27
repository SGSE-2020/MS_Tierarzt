package operations

import (
	"github.com/couchbase/gocb/v2"
	"tierarzt/proto/vetuser"
)

func IsUserEmployee(db *gocb.Cluster, uid *string) vetuser.VetUser {
	query := "SELECT v.* FROM `vetservice` as v " +
		"WHERE v.`isEmployee` IS NOT NULL " +
		"AND v.`uid` == $uid;"
	params := make(map[string]interface{}, 2)
	params["uid"] = uid

	results, err := db.Query(query,
		&gocb.QueryOptions{NamedParameters: params})
	if err != nil {
		panic(err)
	}

	results.Next()
	var vetUserData vetuser.VetUser
	err = results.Row(&vetUserData)
	if err != nil {
		return vetuser.VetUser{}
	}
	return vetUserData
}
