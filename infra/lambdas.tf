locals {
  zip_base = "${path.module}/.."

  # ─────────────────────────────────────────────────────────────────────────────
  # All 8 Lambda services — code + environment variable configuration
  # NOTE: Inter-service base URLs must be the bare API Gateway URL only.
  #       Each client already appends its own path (e.g. /cart/internal/...).
  #       Do NOT add a path suffix here or URLs will double up (e.g. /cart/cart/...).
  # ─────────────────────────────────────────────────────────────────────────────
  lambda_config = {

    "darsani_event-service" = {
      zip     = "${local.zip_base}/event-service/event-service.zip"
      handler = "handler.handler"
      env = merge(local.common_env, {
        EVENT_TABLE_NAME           = "darsani_events"
        INVENTORY_SERVICE_BASE_URL = local.api_base_url
      })
    }

    "darsani_inventory_service" = {
      zip     = "${local.zip_base}/inventory-service/inventory-service.zip"
      handler = "handler.handler"
      env = merge(local.common_env, {
        INVENTORY_TABLE_NAME = "darsani_inventory"
      })
    }

    "darsani_cart_service" = {
      zip     = "${local.zip_base}/cart-service/cart-service.zip"
      handler = "handler.handler"
      env = merge(local.common_env, {
        CART_TABLE_NAME            = "darsani_cart"
        EVENT_SERVICE_BASE_URL     = local.api_base_url
        INVENTORY_SERVICE_BASE_URL = local.api_base_url
        WAITLIST_SERVICE_BASE_URL  = local.api_base_url
      })
    }

    "darsani_order_service" = {
      zip     = "${local.zip_base}/order-service/order-service.zip"
      handler = "handler.handler"
      env = merge(local.common_env, {
        ORDER_TABLE_NAME           = "darsani_orders"
        EVENT_SERVICE_BASE_URL     = local.api_base_url
        INVENTORY_SERVICE_BASE_URL = local.api_base_url
        CART_SERVICE_BASE_URL      = local.api_base_url
        WAITLIST_SERVICE_BASE_URL  = local.api_base_url
        SNS_TOPIC_ARN              = var.sns_topic_arn
      })
    }

    "darsani_payment_service" = {
      zip     = "${local.zip_base}/payment-service/payment-service.zip"
      handler = "handler.handler"
      env = merge(local.common_env, {
        PAYMENT_TABLE_NAME         = "darsani_payments"
        ORDER_SERVICE_BASE_URL     = local.api_base_url
        INVENTORY_SERVICE_BASE_URL = local.api_base_url
        SNS_TOPIC_ARN              = var.sns_topic_arn
      })
    }

    "darsani_notification_service" = {
      zip     = "${local.zip_base}/notification-service/notification-service.zip"
      handler = "handler.handler"
      env = merge(local.common_env, {
        NOTIFICATION_TABLE_NAME = "darsani_notifications"
      })
    }

    "darsani_waitlist_service" = {
      zip     = "${local.zip_base}/waitlist-service/waitlist-service.zip"
      handler = "handler.handler"
      env = merge(local.common_env, {
        WAITLIST_TABLE_NAME           = "darsani_waitlist"
        EVENT_SERVICE_BASE_URL        = local.api_base_url
        INVENTORY_SERVICE_BASE_URL    = local.api_base_url
        NOTIFICATION_SERVICE_BASE_URL = local.api_base_url
      })
    }

    "darsani_user_service" = {
      zip     = "${local.zip_base}/user-service/user-service.zip"
      handler = "handler.handler"
      env = merge(local.common_env, {
        EVENT_TABLE_NAME           = "darsani_events"
        INVENTORY_SERVICE_BASE_URL = local.api_base_url
      })
    }

  }
}

# ── Step 1: Upload zip code for all 8 services ────────────────────────────────
# Triggered automatically when the zip file changes (hash-based).
# Run `python makezip.py` manually inside each service folder before `terraform apply`.
resource "null_resource" "lambda_deploy" {
  for_each = local.lambda_config

  triggers = {
    # try() handles the case where the zip doesn't exist yet
    zip_hash = try(filebase64sha256(each.value.zip), "not-yet-created")
  }

  provisioner "local-exec" {
    interpreter = ["cmd", "/C"]
    command     = "aws lambda update-function-code --function-name %FUNC% --zip-file fileb://%ZIP% --region %REGION% --profile %PROFILE%"
    environment = {
      FUNC    = each.key
      ZIP     = each.value.zip
      REGION  = var.aws_region
      PROFILE = var.aws_profile
    }
  }
}

# ── Step 2: Update handler + environment variables for all 8 services ─────────
# Runs after code upload. Re-runs if env vars or handler change.
resource "null_resource" "lambda_config_update" {
  for_each = local.lambda_config

  depends_on = [null_resource.lambda_deploy]

  triggers = {
    env_hash = sha1(jsonencode(each.value.env))
    handler  = each.value.handler
  }

  provisioner "local-exec" {
    interpreter = ["cmd", "/C"]
    command     = "aws lambda update-function-configuration --function-name %FUNC% --handler %HANDLER% --environment Variables={%ENV_VARS%} --region %REGION% --profile %PROFILE%"
    environment = {
      FUNC     = each.key
      HANDLER  = each.value.handler
      ENV_VARS = join(",", [
        for k, v in each.value.env : "${k}=${v}"
      ])
      REGION  = var.aws_region
      PROFILE = var.aws_profile
    }
  }
}
