variable "image_backend" {
  description = "Backend Docker image"
  type        = string
}

variable "image_frontend" {
  description = "Frontend Docker image"
  type        = string
}

variable "image_migrate" {
  description = "Migrate Docker image"
  type        = string
}

variable "backend_url" {
  description = "Public backend URL"
  type        = string
}

variable "frontend_url" {
  description = "Public frontend URL"
  type        = string
}

variable "postgres_user" {
  type    = string
  default = "effect_stack"
}

variable "postgres_password" {
  type = string
}

variable "postgres_db" {
  type    = string
  default = "effect_stack"
}

variable "s3_endpoint" {
  type = string
}

variable "s3_access_key_id" {
  type = string
}

variable "s3_secret_access_key" {
  type = string
}

variable "s3_bucket" {
  type    = string
  default = "effect-stack"
}

variable "s3_region" {
  type    = string
  default = "us-east-1"
}
