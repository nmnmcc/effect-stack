  group "redis" {
    network {
      mode = "bridge"
      port "redis" { static = 6379 }
    }

    task "redis" {
      driver = "docker"
      config {
        image = "redis:7"
        ports = ["redis"]
        args  = ["--maxmemory", "256mb", "--maxmemory-policy", "allkeys-lru", "--save", "60", "1000"]
      }

      resources {
        cpu    = 200
        memory = 384
      }

      service {
        port = "redis"
        check {
          type     = "tcp"
          interval = "10s"
          timeout  = "2s"
        }
      }
    }
  }
