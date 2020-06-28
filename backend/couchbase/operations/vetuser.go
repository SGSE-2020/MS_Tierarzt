package operations

import (
	"github.com/couchbase/gocb/v2"
	"tierarzt/couchbase"
	"tierarzt/proto/vetuser"
)

func UpdateVetUser(db *gocb.Cluster, vetuserData *vetuser.VetUser) vetuser.VetUser {
	query := "UPDATE `vetservice` as v " +
		"SET v.`firstName` = $firstName, " +
		"v.`lastName` = $lastName, " +
		"v.`gender` = $gender, " +
		"v.`isEmployee` = $isEmployee, " +
		"v.`dept` = $dept " +
		"WHERE v.`vid` IS NOT NULL " +
		"AND v.`uid` == $uid " +
		"RETURNING v.*;"
	params := make(map[string]interface{}, 2)
	params["uid"] = vetuserData.Uid
	params["firstName"] = vetuserData.FirstName
	params["lastName"] = vetuserData.LastName
	params["gender"] = vetuserData.Gender
	params["isEmployee"] = vetuserData.IsEmployee
	params["dept"] = vetuserData.Dept

	results, err := db.Query(query,
		&gocb.QueryOptions{NamedParameters: params})
	if err != nil {
		panic(err)
	}

	results.Next()
	var updatedData vetuser.VetUser
	err = results.Row(&updatedData)
	if err != nil {
		return vetuser.VetUser{}
	}
	return updatedData
}

func CreateVetUser(db *gocb.Cluster, vetuserData *vetuser.VetUser) string {
	bucket := db.Bucket("vetservice")
	collection := bucket.DefaultCollection()

	uuid := couchbase.GetUUID()
	vetuserData.Vid = uuid
	_, err := collection.Upsert(uuid, vetuserData, &gocb.UpsertOptions{})
	if err != nil {
		panic(err)
	}
	return vetuserData.Vid
}

func GetVetUser(db *gocb.Cluster, uid *string) vetuser.VetUser {
	query := "SELECT v.* FROM `vetservice` as v " +
		"WHERE v.`vid` IS NOT NULL " +
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

func DeleteVetUser(db *gocb.Cluster, uid *string) error {
	query := "DELETE FROM `vetservice` as v " +
		"WHERE v.`vid` IS NOT NULL " +
		"AND v.`uid` == $uid " +
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

func GetAllVetUsers(db *gocb.Cluster) []vetuser.VetUser {
	query := "SELECT v.* FROM `vetservice` as v WHERE v.`vid` IS NOT NULL;"
	params := make(map[string]interface{}, 2)

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