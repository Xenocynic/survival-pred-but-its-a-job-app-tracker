const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resume.controller");

router.get("/", resumeController.getResumes);
router.get("/:id", resumeController.getResume);
router.post("/:id", resumeController.postResume);
router.post("/:id/clone", resumeController.cloneResume);
router.post("/:id/attach-resume", resumeController.attachResumeToApplication);
router.patch("/:id", resumeController.updateResume); //optional
module.exports = router;
