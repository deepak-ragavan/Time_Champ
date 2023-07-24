package awsconfig

import (
	"log"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/tracker/pkg/constant"
)

func ConnectToAws() (*session.Session, error) {
	// Create an AWS session
	session, err := session.NewSession(&aws.Config{
		Region:      aws.String(os.Getenv("AWS_REGION")),
		Credentials: credentials.NewStaticCredentials(os.Getenv("AWS_ACCESSKEY_ID"), os.Getenv("AWS_SECRET_ACCESSKEY"), constant.NULL),
	})
	if err != nil {
		log.Println("Failed to create AWS session:", err)
		return session, err
	}
	return session, err
}
