package operations

import (
	"github.com/couchbase/gocb/v2"
	"tierarzt/couchbase"
	"tierarzt/proto/animal"
)

func CreateAnimal(db *gocb.Cluster, animalCreation *animal.AnimalData) string {
	bucket := db.Bucket("vetservice")
	collection := bucket.DefaultCollection()
	uuid := couchbase.GetUUID()
	animalCreation.Animalid = uuid
	_, err := collection.Upsert(uuid, animalCreation, &gocb.UpsertOptions{})
	if err != nil {
		panic(err)
	}
	return uuid
}

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

func UpdateAnimal(db *gocb.Cluster, animalCreation *animal.AnimalData) animal.AnimalData {
	query := "UPDATE `vetservice` as v " +
		"SET v.`animalname` = $animalname, " +
		"v.`animalheight` = $animalheight, " +
		"v.`animalweight` = $animalweight, " +
		"v.`animaltype` = $animaltype, " +
		"v.`animalrace` = $animalrace " +
		"v.`uid` = $uid " +
		"WHERE v.`animalname` IS NOT NULL " +
		"AND v.`animalid` == $animalid " +
		"RETURNING v.*;"
	params := make(map[string]interface{}, 2)
	params["uid"] = animalCreation.Uid
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

	results.Next()
	var updatedData animal.AnimalData
	err = results.Row(&updatedData)
	if err != nil {
		return animal.AnimalData{}
	}
	return updatedData
}

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

func GetAnimal(db *gocb.Cluster, animalid *string) animal.AnimalData {
	query := "SELECT v.* " +
		"FROM `vetservice` as v " +
		"WHERE v.`animalname` IS NOT NULL " +
		"AND v.`animalid` == $animalid;"
	params := make(map[string]interface{}, 2)
	params["animalid"] = animalid

	results, err := db.Query(query,
		&gocb.QueryOptions{NamedParameters: params})
	if err != nil {
		panic(err)
	}

	results.Next()
	var animalData animal.AnimalData
	err = results.Row(&animalData)
	if err != nil {
		return animal.AnimalData{
			Animalid: "",
		}
	}
	return animalData
}

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
