package grpcserver

import (
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"log"

	"golang.org/x/net/context"
	pb "tierarzt/proto/animal"
)

type Server struct{
	pb.UnimplementedAnimalServiceServer
}

func (s *Server) CreateAnimalData(ctx context.Context, animalCreation *pb.AnimalCreation) (*pb.AnimalID, error) {
	return nil, status.Errorf(codes.Unimplemented, "method CreateAnimalData not implemented")
}
func (s *Server) GetAnimalData(ctx context.Context, animalId *pb.AnimalID) (*pb.AnimalData, error) {
	log.Printf("Received animalID: %s", animalId.Animalid)
	return &pb.AnimalData{Animalname: "ServerAnimal"}, nil
}
func (s *Server) DeleteAnimalData(ctx context.Context, animalId *pb.AnimalID) (*pb.Status, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DeleteAnimalData not implemented")
}
func (s *Server) ManipulateAnimalData(ctx context.Context, animalData *pb.AnimalData) (*pb.Status, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ManipulateAnimalData not implemented")
}