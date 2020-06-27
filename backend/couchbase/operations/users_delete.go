package operations

import (
	"github.com/couchbase/gocb/v2"
)

func DeleteUser(db *gocb.Cluster, uid *string) error {
	query := "DELETE FROM `vetservice` as v " +
		"WHERE v.`isEmployee` IS NOT NULL " +
		"AND v.`firstName` == $uid " +
		"RETURNING v.`uid`;"
	params := make(map[string]interface{}, 2)
	params["uid"] = uid

	results, err := db.Query(query,
		&gocb.QueryOptions{NamedParameters: params})
	if err != nil {
		panic(err)
	}

	var deletedId string

	return results.Row(deletedId)
}