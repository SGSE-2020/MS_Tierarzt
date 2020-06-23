package operations

import (
"github.com/couchbase/gocb/v2"
"tierarzt/proto/animal"
)

func GetUserAnimals(db *gocb.Cluster, uid *string) []animal.AnimalData {
	query := "SELECT v.* FROM `vetservice` as v " +
		"WHERE v.`animalname` IS NOT NULL " +
		"AND v.`uid` == $uid;"
	params := make(map[string]interface{}, 2)
	params["uid"] = uid

	results, err := db.Query(query,
		&gocb.QueryOptions{NamedParameters: params})
	if err != nil {
		panic(err)
	}

	var allAnimalData []animal.AnimalData

	for results.Next() {
		var animalData animal.AnimalData
		err := results.Row(&animalData)
		if err != nil {
			panic(err)
		}
		allAnimalData = append(allAnimalData, animalData)
	}

	// always check for errors after iterating
	err = results.Err()
	if err != nil {
		panic(err)
	}

	return allAnimalData
}
