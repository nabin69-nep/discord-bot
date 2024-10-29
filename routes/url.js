const express = require("express");
const { handleRedirect } = require("../controllers/url");
const router = express.Router();
router.get("/:shortId", handleRedirect);

module.exports = router;
