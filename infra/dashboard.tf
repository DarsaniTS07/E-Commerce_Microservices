resource "aws_cloudwatch_dashboard" "darsani_dashboard" {
  dashboard_name = "darsani_cloudwatch_dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApiGateway", "Count", "ApiId", "4bsnhdrhji", { region = "ap-southeast-1" }],
            [".", "Latency", ".", ".", { region = "ap-southeast-1", stat = "Average" }],
            [".", "5xx", ".", ".", { region = "ap-southeast-1" }],
            [".", "IntegrationLatency", ".", ".", { region = "ap-southeast-1", stat = "Average" }],
            [".", "4xx", ".", ".", { region = "ap-southeast-1" }]
          ]
          view   = "singleValue"
          region = "ap-southeast-1"
          period = 300
          stat   = "Sum"
          title  = "API Gateway Metrics"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/CloudFront", "Requests", "Region", "Global", "DistributionId", "E2RTO7JI8YNNET", { region = "us-east-1" }],
            [".", "4xxErrorRate", ".", ".", ".", ".", { region = "us-east-1" }],
            [".", "5xxErrorRate", ".", ".", ".", ".", { region = "us-east-1" }]
          ]
          view   = "bar"
          region = "us-east-1"
          period = 300
          stat   = "Sum"
          title  = "CloudFront (Frontend) Metrics"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Errors", "FunctionName", "darsani_event-service", { region = "ap-southeast-1" }],
            [".", "Throttles", ".", ".", { region = "ap-southeast-1" }],
            [".", "Duration", ".", ".", { region = "ap-southeast-1", stat = "Average" }]
          ]
          view   = "timeSeries"
          stacked = false
          region = "ap-southeast-1"
          period = 300
          stat   = "Sum"
          title  = "Lambda: event-service"
        }
      },
      {
        type   = "metric"
        x      = 6
        y      = 6
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Errors", "FunctionName", "darsani_inventory_service", { region = "ap-southeast-1" }],
            [".", "Throttles", ".", ".", { region = "ap-southeast-1" }],
            [".", "Duration", ".", ".", { region = "ap-southeast-1", stat = "Average" }]
          ]
          view   = "timeSeries"
          stacked = false
          region = "ap-southeast-1"
          period = 300
          stat   = "Sum"
          title  = "Lambda: inventory"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Errors", "FunctionName", "darsani_cart_service", { region = "ap-southeast-1" }],
            [".", "Throttles", ".", ".", { region = "ap-southeast-1" }],
            [".", "Duration", ".", ".", { region = "ap-southeast-1", stat = "Average" }]
          ]
          view   = "timeSeries"
          stacked = false
          region = "ap-southeast-1"
          period = 300
          stat   = "Sum"
          title  = "Lambda: cart"
        }
      },
      {
        type   = "metric"
        x      = 18
        y      = 6
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Errors", "FunctionName", "darsani_order_service", { region = "ap-southeast-1" }],
            [".", "Throttles", ".", ".", { region = "ap-southeast-1" }],
            [".", "Duration", ".", ".", { region = "ap-southeast-1", stat = "Average" }]
          ]
          view   = "timeSeries"
          stacked = false
          region = "ap-southeast-1"
          period = 300
          stat   = "Sum"
          title  = "Lambda: order"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 12
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Errors", "FunctionName", "darsani_payment_service", { region = "ap-southeast-1" }],
            [".", "Throttles", ".", ".", { region = "ap-southeast-1" }],
            [".", "Duration", ".", ".", { region = "ap-southeast-1", stat = "Average" }]
          ]
          view   = "timeSeries"
          stacked = false
          region = "ap-southeast-1"
          period = 300
          stat   = "Sum"
          title  = "Lambda: payment"
        }
      },
      {
        type   = "metric"
        x      = 6
        y      = 12
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Errors", "FunctionName", "darsani_notification_service", { region = "ap-southeast-1" }],
            [".", "Throttles", ".", ".", { region = "ap-southeast-1" }],
            [".", "Duration", ".", ".", { region = "ap-southeast-1", stat = "Average" }]
          ]
          view   = "timeSeries"
          stacked = false
          region = "ap-southeast-1"
          period = 300
          stat   = "Sum"
          title  = "Lambda: notification"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 12
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Errors", "FunctionName", "darsani_waitlist_service", { region = "ap-southeast-1" }],
            [".", "Throttles", ".", ".", { region = "ap-southeast-1" }],
            [".", "Duration", ".", ".", { region = "ap-southeast-1", stat = "Average" }]
          ]
          view   = "timeSeries"
          stacked = false
          region = "ap-southeast-1"
          period = 300
          stat   = "Sum"
          title  = "Lambda: waitlist"
        }
      },
      {
        type   = "metric"
        x      = 18
        y      = 12
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Errors", "FunctionName", "darsani_user_service", { region = "ap-southeast-1" }],
            [".", "Throttles", ".", ".", { region = "ap-southeast-1" }],
            [".", "Duration", ".", ".", { region = "ap-southeast-1", stat = "Average" }]
          ]
          view   = "timeSeries"
          stacked = false
          region = "ap-southeast-1"
          period = 300
          stat   = "Sum"
          title  = "Lambda: user"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 18
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/DynamoDB", "ConsumedReadCapacityUnits", "TableName", "darsani_events", { region = "ap-southeast-1" }],
            [".", "ConsumedWriteCapacityUnits", ".", ".", { region = "ap-southeast-1" }]
          ]
          view   = "timeSeries"
          stacked = true
          region = "ap-southeast-1"
          period = 300
          stat   = "Sum"
          title  = "DynamoDB: events"
        }
      },
      {
        type   = "metric"
        x      = 6
        y      = 18
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/DynamoDB", "ConsumedReadCapacityUnits", "TableName", "darsani_inventory", { region = "ap-southeast-1" }],
            [".", "ConsumedWriteCapacityUnits", ".", ".", { region = "ap-southeast-1" }]
          ]
          view   = "timeSeries"
          stacked = true
          region = "ap-southeast-1"
          period = 300
          stat   = "Sum"
          title  = "DynamoDB: inventory"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 18
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/DynamoDB", "ConsumedReadCapacityUnits", "TableName", "darsani_cart", { region = "ap-southeast-1" }],
            [".", "ConsumedWriteCapacityUnits", ".", ".", { region = "ap-southeast-1" }]
          ]
          view   = "timeSeries"
          stacked = true
          region = "ap-southeast-1"
          period = 300
          stat   = "Sum"
          title  = "DynamoDB: cart"
        }
      },
      {
        type   = "metric"
        x      = 18
        y      = 18
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/DynamoDB", "ConsumedReadCapacityUnits", "TableName", "darsani_orders", { region = "ap-southeast-1" }],
            [".", "ConsumedWriteCapacityUnits", ".", ".", { region = "ap-southeast-1" }]
          ]
          view   = "timeSeries"
          stacked = true
          region = "ap-southeast-1"
          period = 300
          stat   = "Sum"
          title  = "DynamoDB: orders"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 24
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/DynamoDB", "ConsumedReadCapacityUnits", "TableName", "darsani_payments", { region = "ap-southeast-1" }],
            [".", "ConsumedWriteCapacityUnits", ".", ".", { region = "ap-southeast-1" }]
          ]
          view   = "timeSeries"
          stacked = true
          region = "ap-southeast-1"
          period = 300
          stat   = "Sum"
          title  = "DynamoDB: payments"
        }
      },
      {
        type   = "metric"
        x      = 6
        y      = 24
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/DynamoDB", "ConsumedReadCapacityUnits", "TableName", "darsani_notifications", { region = "ap-southeast-1" }],
            [".", "ConsumedWriteCapacityUnits", ".", ".", { region = "ap-southeast-1" }]
          ]
          view   = "timeSeries"
          stacked = true
          region = "ap-southeast-1"
          period = 300
          stat   = "Sum"
          title  = "DynamoDB: notifications"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 24
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/DynamoDB", "ConsumedReadCapacityUnits", "TableName", "darsani_waitlist", { region = "ap-southeast-1" }],
            [".", "ConsumedWriteCapacityUnits", ".", ".", { region = "ap-southeast-1" }]
          ]
          view   = "timeSeries"
          stacked = true
          region = "ap-southeast-1"
          period = 300
          stat   = "Sum"
          title  = "DynamoDB: waitlist"
        }
      },
      {
        type   = "metric"
        x      = 18
        y      = 24
        width  = 6
        height = 6
        properties = {
          metrics = [
            ["AWS/SNS", "NumberOfMessagesPublished", "TopicName", "darsani_event_booking", { region = "ap-southeast-1" }]
          ]
          view   = "bar"
          region = "ap-southeast-1"
          period = 300
          stat   = "Sum"
          title  = "SNS (Events Delivered)"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 30
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Cognito", "SignInSuccesses", "UserPool", "ap-southeast-1_zHUE3mvtH", { region = "ap-southeast-1" }]
          ]
          view   = "singleValue"
          region = "ap-southeast-1"
          period = 300
          stat   = "Sum"
          title  = "Cognito (Auth SignIns)"
        }
      }
    ]
  })
}
