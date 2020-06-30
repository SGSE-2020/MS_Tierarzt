package operations

import (
	"github.com/couchbase/gocb/v2"
	"tierarzt/couchbase"
	"tierarzt/proto/appointment"
)

func CreateAppointment(db *gocb.Cluster, appointmentCreate *appointment.AppointmentCreate) string {
	bucket := db.Bucket("vetservice")
	collection := bucket.DefaultCollection()
	uuid := couchbase.GetUUID()

	appointmentData := appointment.AppointmentData{
		Appointmentid: uuid,
		Uid: appointmentCreate.Uid,
		Start: appointmentCreate.Start,
		End: appointmentCreate.End,
		Animalid: appointmentCreate.Animalid,
		Cost: appointmentCreate.Cost,
		Reason: appointmentCreate.Reason,
	}

	_, err := collection.Upsert(uuid, appointmentData, &gocb.UpsertOptions{})
	if err != nil {
		panic(err)
	}
	return uuid
}

func CreateAppointmentRequest(db *gocb.Cluster, appointmentRequest *appointment.AppointmentRequest) string {
	bucket := db.Bucket("vetservice")
	collection := bucket.DefaultCollection()
	uuid := couchbase.GetUUID()

	appointmentData := appointment.AppointmentRequest{
		Requestid: uuid,
		Uid: appointmentRequest.Uid,
		Start: appointmentRequest.Start,
		End: appointmentRequest.End,
		Animalid: appointmentRequest.Animalid,
		Reason: appointmentRequest.Reason,
	}

	_, err := collection.Upsert(uuid, appointmentData, &gocb.UpsertOptions{})
	if err != nil {
		panic(err)
	}
	return uuid
}

func GetUserAppointments(db *gocb.Cluster, uid *string) []appointment.AppointmentData {
	query := "SELECT v.* FROM `vetservice` as v " +
		"WHERE v.`appointmentid` IS NOT NULL " +
		"AND v.`uid` == $uid;"
	params := make(map[string]interface{}, 2)
	params["uid"] = uid

	results, err := db.Query(query,
		&gocb.QueryOptions{NamedParameters: params})
	if err != nil {
		panic(err)
	}

	var allAppointmentData []appointment.AppointmentData

	for results.Next() {
		var appointmentData appointment.AppointmentData
		err := results.Row(&appointmentData)
		if err != nil {
			panic(err)
		}
		allAppointmentData = append(allAppointmentData, appointmentData)
	}

	// always check for errors after iterating
	err = results.Err()
	if err != nil {
		panic(err)
	}

	return allAppointmentData
}

func GetAppointmentRequests(db *gocb.Cluster) []appointment.AppointmentRequest {
	query := "SELECT v.* FROM `vetservice` as v " +
		"WHERE v.`requestid` IS NOT NULL;"
	params := make(map[string]interface{}, 2)

	results, err := db.Query(query,
		&gocb.QueryOptions{NamedParameters: params})
	if err != nil {
		panic(err)
	}

	var allAppointmentData []appointment.AppointmentRequest

	for results.Next() {
		var appointmentData appointment.AppointmentRequest
		err := results.Row(&appointmentData)
		if err != nil {
			panic(err)
		}
		allAppointmentData = append(allAppointmentData, appointmentData)
	}

	// always check for errors after iterating
	err = results.Err()
	if err != nil {
		panic(err)
	}

	return allAppointmentData
}

func GetAppointment(db *gocb.Cluster, appointmentid *string) appointment.AppointmentData {
	query := "SELECT v.* FROM `vetservice` as v " +
		"WHERE v.`appointmentid` IS NOT NULL " +
		"AND v.`appointmentid` == $appointmentid;"
	params := make(map[string]interface{}, 2)
	params["appointmentid"] = appointmentid

	results, err := db.Query(query,
		&gocb.QueryOptions{NamedParameters: params})
	if err != nil {
		panic(err)
	}

	results.Next()
	var appointmentData appointment.AppointmentData
	err = results.Row(&appointmentData)
	if err != nil {
		return appointment.AppointmentData{
			Appointmentid: "",
		}
	}
	return appointmentData
}

func DeleteAppointmentRequest(db *gocb.Cluster, requestid *string) error {
	query := "DELETE FROM `vetservice` as v " +
		"WHERE v.`requestid` == $requestid " +
		"RETURNING v.`requestid`;"
	params := make(map[string]interface{}, 2)
	params["requestid"] = requestid

	results, err := db.Query(query,
		&gocb.QueryOptions{NamedParameters: params})
	if err != nil {
		panic(err)
	}

	results.Next()
	var deletedId string

	return results.Row(deletedId)
}