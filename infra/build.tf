locals {
  services_list = [
    "event-service",
    "cart-service",
    "inventory-service",
    "order-service",
    "payment-service",
    "notification-service",
    "waitlist-service",
    "user-service",
  ]
}

# ── Auto-build is DISABLED ─────────────────────────────────────────────────────
# Zips are created manually by running `python makezip.py` inside each service folder.
# Enabling this would cause a "filebase64sha256 inconsistent result" error because
# makezip.py runs between `terraform plan` and `terraform apply`, changing the zip hash.
#
# To re-enable auto-build, uncomment the block below AND add this to lambda_deploy:
#   depends_on = [null_resource.build]
#
# resource "null_resource" "build" {
#   for_each = toset(local.services_list)
#
#   triggers = {
#     src_hash = sha1(join("", [
#       for f in fileset("${path.module}/../${each.key}/src", "**/*.js") :
#       filesha1("${path.module}/../${each.key}/src/${f}")
#     ]))
#   }
#
#   provisioner "local-exec" {
#     working_dir = "${path.module}/../${each.key}"
#     interpreter = ["cmd", "/C"]
#     command     = "python makezip.py"
#   }
# }
