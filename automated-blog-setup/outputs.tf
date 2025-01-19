output "spot_instance_public_ip" {
  description = "The public IP address of the Spot instance."
  value       = aws_spot_instance_request.directus_spot_instance.public_ip
}

output "spot_instance_id" {
  description = "The EC2 instance ID of the Spot instance."
  value       = aws_spot_instance_request.directus_spot_instance.spot_instance_id
}

output "spot_instance_ami" {
  description = "The Amazon Machine Image (AMI) used for the Spot instance."
  value       = aws_spot_instance_request.directus_spot_instance.ami
}