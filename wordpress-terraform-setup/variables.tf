variable "aws_region" {
  description = "AWS region where resources will be created"
  default     = "us-east-1"
}

variable "instance_type" {
  description = "Instance type for the EC2 Spot instance"
  default     = "t3.medium"
}

variable "spot_price" {
  description = "Maximum Spot instance price"
  default     = "0.04"  # Adjust the price as needed
}

variable "ssh_public_key" {
  description = "Path to the SSH public key"
  default     = "~/.ssh/id_rsa.pub"
}
