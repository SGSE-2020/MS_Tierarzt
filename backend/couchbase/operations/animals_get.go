package operations

import (
	"github.com/couchbase/gocb/v2"
	"tierarzt/proto/animal"
)

func GetAllAnimals(db *gocb.Cluster) []animal.AnimalData {
	query := "SELECT v.* " +
		"FROM `vetservice` as v " +
		"WHERE v.`animalname` IS NOT NULL;"
	params := make(map[string]interface{}, 2)

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
