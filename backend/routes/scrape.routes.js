const express = require("express");
const router = express.Router();
const scrapeController = require("../controllers/scrape.controller");

router.post("/", scrapeController.getApplications);

module.exports = router;
