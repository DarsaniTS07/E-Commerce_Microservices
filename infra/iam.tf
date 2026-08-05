data "aws_iam_role" "lambda_exec" {
  name = "aws_darsani"
}

resource "aws_iam_role_policy_attachment" "cognito_power_user" {
  role       = data.aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonCognitoPowerUser"
}
