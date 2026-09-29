//Setup Thing

require("dotenv").config();

const { App } = require("@slack/bolt");
const axios = require("axios");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});



// Commands:

//ping - Check bot latency

app.command("/about-vickekatt-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
  console.log(`Ping command executed by ${command.user_name} Latency: ${latency}ms`);
});

//catfact - Get a cat fact

app.command("/about-vickekatt-catfact", async ({ command, ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
    console.log(`Cat fact fetched successfully and sent to ${command.user_name}`);
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
    console.error("Error fetching cat fact:", err);
  }
});

//joke - Get a random joke

app.command("/about-vickekatt-joke", async ({ command, ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
    console.log(`Joke fetched successfully and sent to ${command.user_name}`);
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
    console.error("Error fetching joke:", err);
  }
});

//clear - Clear the chat for the user (Note: This command will only send a message to the user, it won't actually clear the chat history)

app.command("/about-vickekatt-clear", async ({ command, ack, respond }) => {
  await ack();

  await respond({
    text: Array(50).fill("\u200B").join("\n")
  });

  console.log(`Clear command executed by ${command.user_name}`);
});

//help - Show help message

app.command("/about-vickekatt-help", async ({ command, ack, respond }) => {
  await ack();
  await respond({
    text:
`HELP MENU:

Technical Commands:

/about-vickekatt-ping - Check bot latency
/about-vickekatt-help - Show this help message

    
Fun Commands:

/about-vickekatt-catfact - Get a cat fact
/about-vickekatt-joke - Get a random joke


Main Commands:


Note:

This bot is created by Vickekatt.`
  });
  console.log(`Help command executed by ${command.user_name}`);
});



//Check if the bot is running

(async () => {
  await app.start();
  console.log("Bot is running!");
})();