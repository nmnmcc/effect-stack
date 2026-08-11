{
  pkgs,
  inputs,
  ...
}:

{
  packages = with pkgs; [
    git
    nixd
    fish
    go-task
  ];

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs-slim_24;
    yarn = {
      enable = true;
      package = pkgs.yarn-berry_4;
    };
  };
}
