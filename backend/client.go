package main

import (
	"log"
	"tierarzt/proto/appointment"

	"golang.org/x/net/context"
	"google.golang.org/grpc"
)

func main(){
	var conn *grpc.ClientConn
	conn, err := grpc.Dial("localhost:9000", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Client could not connetc: %s", err)
	}
	defer conn.Close()

	appointmentService := appointment.NewAppointmentServiceClient(conn)

	message := appointment.UserID{Uid: "abcd1234"}

	response, err := appointmentService.GetAppointmentsOfUser(context.Background(), &message)
	if err != nil {
		log.Fatalf("Error when calling GetAnimalData: %s", err)
	}

	log.Printf("Response from Server: %s", response.Appointments)
}