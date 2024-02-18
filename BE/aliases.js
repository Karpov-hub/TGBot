const path = require("path");
const aliases = {
  "@": path.resolve(__dirname),
  "@models": path.resolve(__dirname, "models"),
  "@controllers": path.resolve(__dirname, "controllers"),
  "@db": path.resolve(__dirname, "db"),
  "@redisFun": path.resolve(__dirname, "./redisFun"),
  "@queue": path.resolve(__dirname, "./queue"),
  // и так далее
};

require("module-alias").addAliases(aliases);
