package operations

import (
	"github.com/couchbase/gocb/v2"
)

func IsUserEmployee(db *gocb.Cluster, uid *string) bool {
	query := "SELECT v.isEmployee FROM `vetservice` as v " +
		"WHERE v.`isEmployee` IS NOT NULL " +
		"AND v.`uid` == $uid;"
	params := make(map[string]interface{}, 2)
	params["uid"] = uid

	results, err := db.Query(query,
		&gocb.QueryOptions{NamedParameters: params})
	if err != nil {
		panic(err)
	}

	return results.Next()
}
