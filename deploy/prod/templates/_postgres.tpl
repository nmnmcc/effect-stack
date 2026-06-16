  group "postgres" {
    network {
      mode = "bridge"
      port "db" { static = 5432 }
    }

    task "postgres" {
      driver = "docker"
      config {
        image        = "postgres:17"
        ports        = ["db"]
        volumes      = ["effect-stack-postgres:/var/lib/postgresql/data"]
        args         = [
          "-c", "max_connections=200",
          "-c", "shared_buffers=256MB",
          "-c", "effective_cache_size=768MB",
          "-c", "work_mem=4MB",
          "-c", "wal_level=logical",
        ]
      }

      env {
        POSTGRES_USER     = "[[ var "postgres_user" . ]]"
        POSTGRES_PASSWORD = "[[ var "postgres_password" . ]]"
        POSTGRES_DB       = "[[ var "postgres_db" . ]]"
      }

      resources {
        cpu    = 500
        memory = 1024
      }

      service {
        port = "db"
        check {
          type     = "tcp"
          interval = "10s"
          timeout  = "2s"
        }
      }
    }
  }
