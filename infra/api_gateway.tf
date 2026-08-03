# ── Existing HTTP API v2 (darsani_API_Gateway) ────────────────────────────────
# API ID: 4bsnhdrhji  — already has $default stage with auto_deploy=true
# Routes exist at /{service}/{proxy+} — no /api/v1 prefix needed

# ── Data sources ───────────────────────────────────────────────────────────────
data "aws_lambda_function" "event_service"        { function_name = "darsani_event-service" }
data "aws_lambda_function" "inventory_service"    { function_name = "darsani_inventory_service" }
data "aws_lambda_function" "cart_service"         { function_name = "darsani_cart_service" }
data "aws_lambda_function" "order_service"        { function_name = "darsani_order_service" }
data "aws_lambda_function" "payment_service"      { function_name = "darsani_payment_service" }
data "aws_lambda_function" "notification_service" { function_name = "darsani_notification_service" }
data "aws_lambda_function" "waitlist_service"     { function_name = "darsani_waitlist_service" }
data "aws_lambda_function" "user_service"         { function_name = "darsani_user_service" }
