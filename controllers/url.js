const URL = require("../models/shortUrl");
async function handleRedirect(req, res) {
  const { shortId } = req.params;

  try {
    const entry = await URL.findOne({ shortId });

    if (!entry) {
      return res.status(404).send("❌ Short URL not found.");
    }

    // Track visits (optional)
    entry.visitHistory.push({ timestamp: new Date() });
    await entry.save();

    // Redirect to the original URL
    return res.redirect(entry.redirectUrl);
  } catch (error) {
    console.error("Error during redirection:", error);
    res.status(500).send("❌ Internal Server Error.");
  }
}

module.exports = { handleRedirect };
