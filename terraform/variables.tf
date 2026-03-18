variable "aws_region" {
  default = "eu-west-1"
}

variable "instance_type" {
  default = "m7i-flex.large"
}

variable "key_name" {
  description = "terraform_acces_key"
  type        = string
}

variable "public_key_path" {
  description = "Path to the SSH public key file used for AWS key pair"
  type        = string
}

variable "project_name" {
  default = "devops-match-predictor"
}