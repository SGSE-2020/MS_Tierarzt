package operations

import (
	"github.com/couchbase/gocb/v2"
	"tierarzt/proto/appointment"
)

func GetAppointmentsForUser(db *gocb.Cluster, uid *string) []appointment.AppointmentData {
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