package handler

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"net/http"
	"tierarzt/proto/account"
	"tierarzt/proto/user"
)

var GRPC_HOST_CIVIL_OFFICE = "ms-buergerbuero"
var GRPC_HOST_BANK = "ms-bank"
var GRPC_PORT = "50051"

var grpc_client *grpc.ClientConn

func ValidateUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		userA := user.UserToken{}

		c.Bind(&userA)

		if ConnectGRPC(GRPC_HOST_CIVIL_OFFICE) {
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
					c.JSON(http.StatusOK, userData)
				}
			}
		}
	}
}

func GetUserData() gin.HandlerFunc {
	return func(c *gin.Context) {
		userid := c.Param("userid")

		userId := user.UserId{
			Uid: userid,
		}

		if ConnectGRPC(GRPC_HOST_CIVIL_OFFICE) {
			client := user.NewUserServiceClient(grpc_client)
			ctx := context.Background()
			userData, err := client.GetUser(ctx, &userId)
			if err != nil {
				c.JSON(http.StatusInternalServerError, map[string]string{
					"User ID": "Der gRPC Call GetUser hat nicht geklappt, weil:" + grpc.ErrorDesc(err),
				})
			} else {
				c.JSON(http.StatusOK, userData)
			}
		}
	}
}

func TransferCost() gin.HandlerFunc {
	return func(c *gin.Context) {
		transfer := account.Transfer{}

		c.Bind(&transfer)

		if ConnectGRPC(GRPC_HOST_BANK) {
			client := account.NewAccountServiceClient(grpc_client)
			ctx := context.Background()
			transferMessage, err := client.Transfer(ctx, &transfer)
			if err != nil {
				c.JSON(http.StatusInternalServerError, map[string]string{
					"Error": "Der gRPC Call GetUser hat nicht geklappt, weil:" + grpc.ErrorDesc(err),
				})
			} else {
				c.JSON(http.StatusOK, transferMessage)
			}
		}
	}
}

func GetIban() gin.HandlerFunc {
	return func(c *gin.Context) {
		userid := c.Param("userid")

		userData := account.UserId{
			UserId: userid,
		}

		if ConnectGRPC(GRPC_HOST_BANK) {
			client := account.NewAccountServiceClient(grpc_client)
			ctx := context.Background()
			accountMessage, err := client.GetIban(ctx, &userData)
			if err != nil {
				c.JSON(http.StatusInternalServerError, map[string]string{
					"Error": "Der gRPC Call GetUser hat nicht geklappt, weil:" + grpc.ErrorDesc(err),
				})
			} else {
				c.JSON(http.StatusOK, accountMessage)
			}
		}
	}
}

func ConnectGRPC(host string) bool {
	conn, err := grpc.Dial(
		host+":"+GRPC_PORT, grpc.WithInsecure())
	if err != nil {
		fmt.Print(err)
		return false
	} else {
		grpc_client = conn
		return true
	}
}