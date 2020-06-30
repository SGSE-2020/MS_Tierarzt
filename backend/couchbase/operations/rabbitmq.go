package operations

import (
	"github.com/couchbase/gocb/v2"
	"tierarzt/couchbase"
	"tierarzt/proto/rabbitmq"
)

func CreateRabbitMessage(db *gocb.Cluster, body string) string {
	bucket := db.Bucket("vetservice")
	collection := bucket.DefaultCollection()
	uuid := couchbase.GetUUID()

	rabbitMq := rabbitmq.RabbitMQData{
		Rabbitid: uuid,
		Body: body,
	}

	_, err := collection.Upsert(uuid, rabbitMq, &gocb.UpsertOptions{})
	if err != nil {
		panic(err)
	}
	return uuid
}

func GetRabbitMq(db *gocb.Cluster) []rabbitmq.RabbitMQData {
	query := "SELECT v.* " +
		"FROM `vetservice` as v " +
		"WHERE v.`rabbitid` IS NOT NULL;"
	params := make(map[string]interface{}, 2)

	results, err := db.Query(query,
		&gocb.QueryOptions{NamedParameters: params})
	if err != nil {
		panic(err)
	}

	var allData []rabbitmq.RabbitMQData

	for results.Next() {
		var rabbitData rabbitmq.RabbitMQData
		err := results.Row(&rabbitData)
		if err != nil {
			panic(err)
		}
		allData = append(allData, rabbitData)
	}

	// always check for errors after iterating
	err = results.Err()
	if err != nil {
		panic(err)
	}

	return allData
}