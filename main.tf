terraform {
  required_providers {
    heroku = {
      source  = "heroku/heroku"
      version = "~> 4.6.0"
    }
  }

  required_version = ">= 1.1.0"
}

provider "heroku" {
  api_key = var.heroku_api_key
  email   = var.heroku_email
}

resource "heroku_app" "api" {
  name   = "ezbackend-example-postgres"
  region = "us"

  config_vars = {
    NODE_ENV                     = "production"
    NODE_TLS_REJECT_UNAUTHORIZED = 0
    GOOGLE_CLIENT_ID             = var.google_client_id
    GOOGLE_CLIENT_SECRET         = var.google_client_secret
    CLIENT_URL                   = "https://ezbackend-example-postgres-remix.vercel.app"
    PRODUCTION_URL               = "https://ezbackend-example-postgres.herokuapp.com" // ideally we could self reference
  }
}

resource "heroku_addon" "postgres" {
  app  = heroku_app.api.id
  plan = "heroku-postgresql:hobby-dev"
}

resource "heroku_build" "api" {
  app = heroku_app.api.id
  buildpacks = [
    "https://github.com/heroku/heroku-buildpack-nodejs"
  ]

  source {
    path = "api"
  }

  // See https://www.terraform.io/language/meta-arguments/lifecycle#create_before_destroy
  lifecycle {
    create_before_destroy = true
  }
}
