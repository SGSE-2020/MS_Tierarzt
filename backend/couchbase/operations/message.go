package operations

import (
	"github.com/couchbase/gocb/v2"
	"tierarzt/couchbase"
	"tierarzt/proto/message"
)

func CreateMessage(db *gocb.Cluster, messageCreate *message.MessageCreate) string {
	bucket := db.Bucket("vetservice")
	collection := bucket.DefaultCollection()
	uuid := couchbase.GetUUID()

	messageData := message.MessageData{
		Mid: uuid,
		Uid: messageCreate.Uid,
		Messagetext: messageCreate.Messagetext,
		Read: false,
	}

	_, err := collection.Upsert(uuid, messageData, &gocb.UpsertOptions{})
	if err != nil {
		panic(err)
	}
	return uuid
}

func GetMessage(db *gocb.Cluster, mid *string) message.MessageData {
	query := "SELECT v.* FROM `vetservice` as v " +
		"WHERE v.`mid` IS NOT NULL " +
		"AND v.`mid` == $mid;"
	params := make(map[string]interface{}, 2)
	params["uid"] = mid

	results, err := db.Query(query,
		&gocb.QueryOptions{NamedParameters: params})
	if err != nil {
		panic(err)
	}

	results.Next()
	var messageData message.MessageData
	err = results.Row(&messageData)
	if err != nil {
		return message.MessageData{}
	}
	return messageData
}

func GetUserMessages(db *gocb.Cluster, uid *string) []message.MessageData {
	query := "SELECT v.* FROM `vetservice` as v " +
		"WHERE v.`mid` IS NOT NULL " +
		"AND v.`uid` == $uid;"
	params := make(map[string]interface{}, 2)
	params["uid"] = uid

	results, err := db.Query(query,
		&gocb.QueryOptions{NamedParameters: params})
	if err != nil {
		panic(err)
	}

	var allMessageData []message.MessageData

	for results.Next() {
		var messageData message.MessageData
		err := results.Row(&messageData)
		if err != nil {
			panic(err)
		}
		allMessageData = append(allMessageData, messageData)
	}

	// always check for errors after iterating
	err = results.Err()
	if err != nil {
		panic(err)
	}

	return allMessageData
}

func DeleteMessage(db *gocb.Cluster, mid *string) error {
	query := "DELETE FROM `vetservice` as v " +
		"WHERE v.`mid` == $mid " +
		"RETURNING v.`requestid`;"
	params := make(map[string]interface{}, 2)
	params["mid"] = mid

	results, err := db.Query(query,
		&gocb.QueryOptions{NamedParameters: params})
	if err != nil {
		panic(err)
	}

	results.Next()
	var deletedId string

	return results.Row(deletedId)
}

func UpdateMessage(db *gocb.Cluster, messageData *message.MessageData) message.MessageData {
	query := "UPDATE `vetservice` as v " +
		"SET v.`uid` = $uid, " +
		"v.`messagetext` = $messagetext, " +
		"v.`read` = $read " +
		"WHERE v.`mid` IS NOT NULL " +
		"AND v.`mid` == $mid " +
		"RETURNING v.*;"
	params := make(map[string]interface{}, 2)
	params["mid"] = messageData.Mid
	params["uid"] = messageData.Uid
	params["messagetext"] = messageData.Messagetext
	params["read"] = messageData.Read

	results, err := db.Query(query,
		&gocb.QueryOptions{NamedParameters: params})
	if err != nil {
		panic(err)
	}


	results.Next()
	var updatedData message.MessageData
	err = results.Row(&updatedData)
	if err != nil {
		return message.MessageData{}
	}
	return updatedData
}