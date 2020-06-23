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
		Date: appointmentCreate.Date,
		Duration: appointmentCreate.Duration,
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