provider "aws" {
  region = var.aws_region
}

data "aws_subnets" "selected_subnets" {
  filter {
    name   = "availability-zone"
    values = ["us-east-1a"]  # Change to a valid AZ as needed (e.g., us-east-1b, etc.)
  }

  filter {
    name   = "default-for-az"
    values = ["true"]  # Ensure it's a default public subnet for the AZ
  }
}

resource "aws_key_pair" "blog_key" {
  key_name   = "blog-ssh-key"
  public_key = file(var.ssh_public_key)
}

resource "aws_security_group" "blog_sg" {
  name_prefix = "directus-sg"

  ingress {
    description = "Allow Directus HTTP"
    from_port   = 8055
    to_port     = 8055
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow MongoDB"
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow FastAPI HTTP"
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow SSH Access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"  # -1 allows all protocols
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "Directus-Security-Group"
  }
}

resource "aws_spot_instance_request" "directus_spot_instance" {
  ami                = "ami-0c02fb55956c7d316"
  instance_type      = var.instance_type
  spot_price         = var.spot_price
  subnet_id          = data.aws_subnets.selected_subnets.ids[0]
  key_name           = aws_key_pair.blog_key.key_name
  vpc_security_group_ids = [aws_security_group.blog_sg.id]

  root_block_device {
    volume_size = 30
  }

  # Externalized user_data script
  user_data = file("${path.module}/user_data.sh")

  tags = {
    Name = "Directus-Spot-Instance"
  }
}