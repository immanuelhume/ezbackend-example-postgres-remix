variable "heroku_api_key" {
  type        = string
  description = "Authorization token for Terraform, obtained in the Heroku Application dashboard."
  sensitive   = true
}

variable "heroku_email" {
  type        = string
  description = "Heroku account email."
  sensitive   = true
}

variable "google_client_id" {
  type        = string
  description = "Google OAuth client ID."
  sensitive   = true
}

variable "google_client_secret" {
  type        = string
  description = "Google OAuth client secret."
  sensitive   = true
}
