package operations

import (
	"github.com/couchbase/gocb/v2"
	"tierarzt/proto/vetuser"
)

func GetAllUsers(db *gocb.Cluster) []vetuser.VetUser {
	query := "SELECT v.* FROM `vetservice` as v WHERE v.`isEmployee` IS NOT NULL;"
	params := make(map[string]interface{}, 2)
	params["animalname"] = "animalname"
	params["animaltype"] = "animaltype"

	results, err := db.Query(query,
		&gocb.QueryOptions{NamedParameters: params})
	if err != nil {
		panic(err)
	}

	var allUserData []vetuser.VetUser

	for results.Next() {
		var userData vetuser.VetUser
		err := results.Row(&userData)
		if err != nil {
			panic(err)
		}
		allUserData = append(allUserData, userData)
	}

	// always check for errors after iterating
	err = results.Err()
	if err != nil {
		panic(err)
	}

	return allUserData
}