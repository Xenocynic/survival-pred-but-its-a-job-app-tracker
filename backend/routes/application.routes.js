const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/application.controller");


router.get("/", applicationController.getApplications);

router.get("/:id", applicationController.getApplication);

router.post("/", applicationController.postApplication);

// router.patch("/:id/move", applicationController.moveApplication); //Moving an application involves changing the <staging status> of that application

router.patch("/:id", applicationController.updateApplication); //update application details (optional)

router.delete("/:id", applicationController.deleteApplication);

module.exports = router;