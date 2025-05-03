//provider "aws" {
//  region     = var.aws_region
//  access_key = var.access_key
//  secret_key = var.secret_key
//}

# Create Security Group to allow port 80, 443
resource "aws_security_group" "allow_web" {
  name        = "plm-staging-sg-br-X"
  description = "Allow Web inbound traffic"
  vpc_id      = var.vpc_id
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name = "plm-staging-sg-br-X"
  }
}


# Create a network interface with an ip in the subnet
resource "aws_network_interface" "web-server-nic" {
  subnet_id       = var.subnet_id
  security_groups = [aws_security_group.allow_web.id]
  tags = {
    Name = "plm-staging-ni-br-X"
  }
}


# Assign an Elastic IP to the network interface created
resource "aws_eip" "elastic-ip" {
  domain                    = "vpc"
  network_interface         = aws_network_interface.web-server-nic.id
  associate_with_private_ip = aws_network_interface.web-server-nic.private_ip
  depends_on = [ aws_instance.ec2-staging ]
  tags = {
    Name = "plm-staging-eip-br-X"
  }
}

output "server_public_ip" {
  value = aws_eip.elastic-ip.public_ip
}


# Create an EC2 instance and install Docker
resource "aws_instance" "ec2-staging" {
  ami               = var.ami_id
  instance_type     = var.instance_type
  key_name          = var.key_pair
  availability_zone = var.ec2_availability_zone

  network_interface {
    device_index         = 0
    network_interface_id = aws_network_interface.web-server-nic.id
  }

  user_data = <<-EOF
                #!/bin/bash
                sudo yum update -y
                sudo amazon-linux-extras install docker
                sudo service docker start
                sudo usermod -a -G docker ec2-user
                EOF

  tags = {
    Name = "plm-staging-instance-branch-X"
  }

}
