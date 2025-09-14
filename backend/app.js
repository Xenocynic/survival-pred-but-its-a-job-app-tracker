const express = require("express");
const cors = require("cors");
const app = express();

const PORT = 5000;


//-- APIs

const applicationRoutes = require("./routes/application.routes");
// const notificationRoutes = require("./routes/notification.routes");
// const resumeRoutes = require("./routes/resume.routes");
// const analyticsRoutes = require("./routes/analytics.routes")
const scrapeRoutes = require("./routes/scrape.routes.js");

app.use(express.json());

app.use( cors({ origin: "http://localhost:5173", credentials: true })); // CORS that allows cookies to be sent


//-- ROUTES
app.use("/api/applications", applicationRoutes);
// app.use("/api/reminders", reminderRoutes);
// app.use("/api/responses", responseRoutes);
// app.use("/api/resumes", resumeRoutes);
// app.use("/api/status", statusRoutes);
app.use("/api/scrape", scrapeRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to our API" });
});

app.listen(PORT, () => {
  console.log(`server successfully listening on port: ${PORT}`);
});
