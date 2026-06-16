  group "app" {
    network {
      mode = "bridge"
      port "backend"  { static = 30000 }
      port "frontend" { static = 3000 }
    }

    task "migrate" {
      driver = "docker"
      lifecycle {
        hook    = "prestart"
        sidecar = false
      }
      config {
        image = "[[ var "image_migrate" . ]]"
      }

      env {
        DATABASE_URL = "postgresql://[[ var "postgres_user" . ]]:[[ var "postgres_password" . ]]@localhost:5432/[[ var "postgres_db" . ]]"
      }
    }

    task "backend" {
      driver = "docker"
      config {
        image = "[[ var "image_backend" . ]]"
        ports = ["backend"]
      }

      env {
        PORT                 = "30000"
        BETTER_AUTH_URL      = "[[ var "backend_url" . ]]"
        CORS_ORIGINS         = "[[ var "frontend_url" . ]]"
        DATABASE_URL         = "postgresql://[[ var "postgres_user" . ]]:[[ var "postgres_password" . ]]@localhost:5432/[[ var "postgres_db" . ]]"
        S3_ENDPOINT          = "[[ var "s3_endpoint" . ]]"
        S3_ACCESS_KEY_ID     = "[[ var "s3_access_key_id" . ]]"
        S3_SECRET_ACCESS_KEY = "[[ var "s3_secret_access_key" . ]]"
        S3_BUCKET            = "[[ var "s3_bucket" . ]]"
        S3_REGION            = "[[ var "s3_region" . ]]"
      }

      resources {
        cpu    = 500
        memory = 512
      }

      service {
        port = "backend"
        check {
          type     = "tcp"
          interval = "10s"
          timeout  = "2s"
        }
      }
    }

    task "frontend" {
      driver = "docker"
      config {
        image = "[[ var "image_frontend" . ]]"
        ports = ["frontend"]
      }

      env {
        BACKEND_URL = "http://localhost:30000"
      }

      resources {
        cpu    = 300
        memory = 512
      }

      service {
        port = "frontend"
        check {
          type     = "tcp"
          interval = "10s"
          timeout  = "2s"
        }
      }
    }
  }
