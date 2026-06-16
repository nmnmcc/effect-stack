job "effect-stack" {
  type        = "service"
  datacenters = ["dc1"]

  [[ template "_postgres" . ]]
  [[ template "_redis" . ]]
  [[ template "_app" . ]]
}
