package main

import (
	"google.golang.org/grpc"
	"log"
	"net"
	"tierarzt/grpcserver"
	"tierarzt/proto/appointment"
)

func main(){
	lis, err := net.Listen("tcp", ":9000")
	if err != nil {
		log.Fatalf("Failed to listen on port 50051: %v", err)
	}

	grpcServer := grpc.NewServer()
	appointment.RegisterAppointmentServiceServer(grpcServer, &grpcserver.AppointmentServer{})

	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("Failed to serve gRPC server on port 50051: %v", err)
	}
}
