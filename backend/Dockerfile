FROM golang:alpine

ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

# Move to working directory /build
RUN mkdir /build
WORKDIR /build

# Copy and download dependency using go mod
COPY go.mod .
COPY go.sum .
RUN go mod download

# Copy the code into the container
COPY . .

# Build the application
#RUN go build -o main .
RUN go build main.go
RUN go build grpc.go

# Move to /dist directory as the place for resulting binary folder
RUN mkdir /dist
WORKDIR /dist

# Copy binary from build to couchbase folder
RUN cp /build/main .

# Command to run when starting the container
CMD ["/dist/main"]

EXPOSE 8080 9000