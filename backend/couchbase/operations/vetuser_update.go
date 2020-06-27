package operations

import (
	"github.com/couchbase/gocb/v2"
	"tierarzt/proto/vetuser"
)

func UpdateVetUser(db *gocb.Cluster, vetuserData *vetuser.VetUser) error {
	query := "UPDATE `vetservice` as v " +
		"SET v.`firstName` = $firstName, " +
		"v.`lastName` = $lastName, " +
		"v.`gender` = $gender, " +
		"v.`isEmployee` = $isEmployee " +
		"WHERE v.`isEmployee` IS NOT NULL " +
		"AND v.`uid` == $uid " +
		"RETURNING v.*;"
	params := make(map[string]interface{}, 2)
	params["uid"] = vetuserData.Uid
	params["firstName"] = vetuserData.FirstName
	params["lastName"] = vetuserData.LastName
	params["gender"] = vetuserData.Gender
	params["isEmployee"] = vetuserData.IsEmployee

	results, err := db.Query(query,
		&gocb.QueryOptions{NamedParameters: params})
	if err != nil {
		panic(err)
	}

	var updatedData vetuser.VetUser

	return results.Row(updatedData)
}
