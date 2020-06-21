package grpcserver

import (
	"golang.org/x/net/context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	pb "tierarzt/proto/appointment"
)

type AppointmentServer struct {
	pb.UnimplementedAppointmentServiceServer
}

func (s *AppointmentServer) CreateAppointment(context.Context, *pb.AppointmentCreate) (*pb.AppointmentID, error) {
	return nil, status.Errorf(codes.Unimplemented, "method CreateAppointment not implemented")
}
func (s *AppointmentServer) RequestAppointment(context.Context, *pb.AppointmentRequest) (*pb.AppointmentResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method RequestAppointment not implemented")
}
func (s *AppointmentServer) DecideAppointment(context.Context, *pb.AppointmentID) (*pb.AppointmentData, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DecideAppointment not implemented")
}
func (s *AppointmentServer) DeleteAppointment(context.Context, *pb.AppointmentID) (*pb.Status, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DeleteAppointment not implemented")
}
func (s *AppointmentServer) GetAppointment(context.Context, *pb.AppointmentID) (*pb.AppointmentData, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetAppointment not implemented")
}
func (s *AppointmentServer) GetAppointmentsOfUser(ctx context.Context, userid *pb.UserID) (*pb.AppointmentsOfUser, error) {
	appointment := pb.Appointment{
		Uid: userid.Uid,
		Date: "01.01.2020",
		Duration: 90,
		}
	var appointments []*pb.Appointment

	appointments = append(appointments, &appointment)

	return &pb.AppointmentsOfUser{Appointments: appointments}, nil
}