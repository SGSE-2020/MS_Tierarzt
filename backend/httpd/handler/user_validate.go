package handler

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"net/http"
	"tierarzt/proto/user"
)

var GRPC_HOST = "ms-buergerbuero"
var GRPC_PORT = "50051"

var grpc_client *grpc.ClientConn

func ValidateUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		userA := user.UserToken{}

		c.Bind(&userA)

		if ConnectGRPC() {
			client := user.NewUserServiceClient(grpc_client)
			ctx := context.Background()
			verifiedUser, err := client.VerifyUser(ctx, &user.UserToken{Token: userA.Token})
			if err != nil {
				c.JSON(http.StatusInternalServerError, map[string]string{
					"User ID": "Der gRPC Call VerifyUser hat nicht geklappt, weil:" + grpc.ErrorDesc(err),
				})
			} else {
				userData, err := client.GetUser(ctx, &user.UserId{Uid: verifiedUser.Uid})
				if err != nil {
					c.JSON(http.StatusInternalServerError, map[string]string{
						"User ID": "Der gRPC Call GetUser hat nicht geklappt",
					})
				} else {
					c.JSON(http.StatusInternalServerError, userData)
				}
			}
		}
	}
}

func ConnectGRPC() bool {
	conn, err := grpc.Dial(
		GRPC_HOST+":"+GRPC_PORT, grpc.WithInsecure())
	if err != nil {
		fmt.Print("Keine Verbindung zum grpc-Server")
		fmt.Print(err)
		return false
	} else {
		fmt.Println("Ich gehe hier trotzdem rein")
		grpc_client = conn
		return true
	}
}