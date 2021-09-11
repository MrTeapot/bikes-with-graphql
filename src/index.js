const { createApp } = require("./app.js");

(async () => {

  await createApp({
    port: process.env.PORT || 5000,
    dbUrl: process.env.POSTGRES_DB_URL
  });

})();