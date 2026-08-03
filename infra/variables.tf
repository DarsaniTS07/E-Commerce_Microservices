variable "aws_region" {
  default = "ap-southeast-1"
}

variable "aws_profile" {
  default = "Darsani"
}

variable "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
}

variable "cognito_client_id" {
  description = "Cognito App Client ID"
}

variable "internal_api_key" {
  description = "Shared internal API key for service-to-service calls"
  sensitive   = true
}

variable "sns_topic_arn" {
  description = "SNS topic ARN for order/payment notifications"
}

variable "account_id" {
  description = "AWS Account ID"
}
