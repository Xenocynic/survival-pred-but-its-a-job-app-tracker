const express = require("express");
const router = express.Router();
const applicationController = require("reminder.controller.js");

router.get("/", applicationController.getApplications);
router.post("/", applicationController.postApplication);
router.get("/applications/:id", applicationController.getApplication);
router.put("/applications/:id", applicationController.updateAllApplication);
router.patch("/applications/:id", applicationController.updateSomeApplication);
router.delete("/applications/:id", applicationController.deleteApplication);

module.exports = router;