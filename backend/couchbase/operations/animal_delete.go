package operations

import (
	"github.com/couchbase/gocb/v2"
)

func DeleteAnimal(db *gocb.Cluster, animalid *string) error {
	query := "DELETE FROM `vetservice` as v " +
		"WHERE v.`animalid` == $animalid " +
		"RETURNING v.`animalid`;"
	params := make(map[string]interface{}, 2)
	params["animalid"] = animalid

	results, err := db.Query(query,
		&gocb.QueryOptions{NamedParameters: params})
	if err != nil {
		panic(err)
	}

	var deletedId string

	return results.Row(deletedId)
}
