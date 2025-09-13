const express = require("express");
const cors = require("cors");

const app = express();

//-- APIs
const applicationRoutes = require("./routes/application.routes.js");
const statusRoutes = require("./routes/status.routes.js");
const resumeRoutes = require("./routes/resume.routes.js");
const responseRoutes = require("./routes/response.routes.js");
const reminderRoutes = require("./routes/reminder.routes.js");

app.use("api/receive-applications");
app.use("api/applications", applicationRoutes);
app.use("api/status", applicationRoutes);
app.use("api/resume", applicationRoutes);
app.use("api/response", applicationRoutes);
app.use("api/reminder", applicationRoutes);

app.get("/", (req, res, next) => {
  res.send("Application Tracker API is working...");
});


app.listen(5000, () => {
  console.log("api is working.");
});
