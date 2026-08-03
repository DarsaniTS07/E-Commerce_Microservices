locals {
  api_endpoint = "https://4bsnhdrhji.execute-api.ap-southeast-1.amazonaws.com"
}

output "api_base_url" {
  value = local.api_endpoint
}

output "service_urls" {
  value = {
    events        = "${local.api_endpoint}/events"
    inventory     = "${local.api_endpoint}/inventory"
    cart          = "${local.api_endpoint}/cart"
    orders        = "${local.api_endpoint}/orders"
    payments      = "${local.api_endpoint}/payments"
    notifications = "${local.api_endpoint}/notifications"
    waitlist      = "${local.api_endpoint}/waitlist"
    users         = "${local.api_endpoint}/users"
  }
}
