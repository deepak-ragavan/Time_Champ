package awsconfig

import (
	"fmt"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
)

func ConnectToAws() (*session.Session, error) {
	// Create an AWS session
	session, err := session.NewSession(&aws.Config{
		Region:      aws.String(os.Getenv("AwsRegion")),
		Credentials: credentials.NewStaticCredentials(os.Getenv("AwsAccessKeyID"), os.Getenv("AwsSecretAccessKey"), ""),
	})
	if err != nil {
		fmt.Println("Failed to create AWS session:", err)
		return session, err
	}
	return session, err
}
