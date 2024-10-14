require('dotenv').config({ path: '.env.sample' });
const PORT = 5005;
const express = require("express");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

//config
const configs = require("./config");
configs(app);

require("./db");


// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

const indexRouter = require("./routes/index.route")
app.use("/api", indexRouter)

const authRouter = require("./routes/auth.routes")
app.use("/auth", authRouter);

//errores
const errorHandling = require("./error-handlers");
errorHandling(app);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});