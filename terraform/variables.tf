/*
variable "aws_region" {
  description = "AWS Region"
  type        = string
}

variable "access_key" {
  description = "AWS Access Key"
  type        = string
}

variable "secret_key" {
  description = "AWS Secret Key"
  type        = string
}
*/

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "subnet_id" {
  description = "Subnet ID"
  type        = string
}

variable "ami_id" {
  description = "ID de l'AMI EC2"
  type        = string
}

variable "instance_type" {
  description = "Type d'instance EC2"
  type        = string
}

variable "ec2_availability_zone" {
  description = "EC2 Availability Zone"
  type        = string
}

variable "key_pair" {
  description = "EC2 staging key pair"
  type        = string
}
