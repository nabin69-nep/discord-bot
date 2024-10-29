const { Client, GatewayIntentBits } = require("discord.js");
const connectDb = require("./connect");
const express = require("express");
const port = 8000;
const app = express();
const shortid = require("shortid");
const URL = require("./models/shortUrl");
const Urlroutes = require("./routes/url");
require("dotenv").config();
//Connecting Db

connectDb(process.env.MONGODB_URI)
  .then(() => console.log("Connect"))
  .catch((err) => console.log(err));

//Discord Connection
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.on("messageCreate", async (message) => {
  if (message.author.bot) return; // Ignore bot messages

  const content = message.content.trim().toLowerCase(); // Normalize input

  // Handle "create" command for URL shortener
  if (content.startsWith("create ")) {
    const url = message.content.split(" ")[1]?.trim(); // Get URL after command

    if (!url) {
      return message.reply(
        "❌ Please provide a valid URL starting with http:// or https://."
      );
    }

    try {
      const shortId = shortid.generate(); // Generate a unique short ID
      await URL.create({
        shortId,
        redirectUrl: url,
        visitHistory: [],
      });

      return message.reply(
        `✅ Short URL created: http://localhost:${process.env.PORT}/${shortId}`
      );
    } catch (error) {
      console.error("Error creating short URL:", error);
      return message.reply("❌ Failed to create the short URL.");
    }
  } else {
    // Default response for any other message
    message.reply("Hello from the Bot!");
  }
});

//routes
app.use("/", Urlroutes);

client.login(process.env.DISCORD_TOKEN);

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand() && interaction.commandName === "ping") {
    await interaction.reply("🏓 Pong!!");
  }
});
app.listen(port, () =>
  console.log("Starting server on port", process.env.PORT)
);
