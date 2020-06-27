package operations

import (
	"github.com/couchbase/gocb/v2"
	"tierarzt/proto/animal"
)

func UpdateAnimal(db *gocb.Cluster, animalCreation *animal.AnimalData) error {
	query := "UPDATE `vetservice` as v " +
		"SET v.`animalname` = $animalname, " +
		"v.`animalheight` = $animalheight, " +
		"v.`animalweight` = $animalweight, " +
		"v.`animaltype` = $animaltype, " +
		"v.`animalrace` = $animalrace " +
		"WHERE v.`animalname` IS NOT NULL " +
		"AND v.`animalid` == $animalid " +
		"RETURNING v.*;"
	params := make(map[string]interface{}, 2)
	params["animalid"] = animalCreation.Animalid
	params["animalname"] = animalCreation.Animalname
	params["animalheight"] = animalCreation.Animalheight
	params["animalweight"] = animalCreation.Animalweight
	params["animaltype"] = animalCreation.Animaltype
	params["animalrace"] = animalCreation.Animalrace

	results, err := db.Query(query,
		&gocb.QueryOptions{NamedParameters: params})
	if err != nil {
		panic(err)
	}

	var updatedData animal.AnimalData

	return results.Row(updatedData)
}
