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



//github - Show GitHub stats

app.command("/about-vickekatt-github", async ({ command, ack, respond }) => {
  await ack();

  try {
    const userResponse = await axios.get(
      "https://api.github.com/users/VickeKatt"
    );

    let repos = [];
    let repoPage = 1;

    while (true) {
      const response = await axios.get(
        `https://api.github.com/users/VickeKatt/repos?per_page=100&page=${repoPage}`
      );

      repos.push(...response.data);

      if (response.data.length < 100) {
        break;
      }

      repoPage++;
    }

    const stars = repos.reduce(
      (total, repo) => total + repo.stargazers_count,
      0
    );

    let commits = 0;

    for (const repo of repos) {
      let commitPage = 1;

      while (true) {
        try {
          const response = await axios.get(
            `https://api.github.com/repos/VickeKatt/${repo.name}/commits?per_page=100&page=${commitPage}`
          );

          commits += response.data.length;

          if (response.data.length < 100) {
            break;
          }

          commitPage++;
        } catch (err) {
          console.error(`Failed to fetch commits for ${repo.name}`);
          break;
        }
      }
    }

    await respond({
      text:
`*VickeKatt GitHub Stats*

Repositories: ${userResponse.data.public_repos}
Commits: ${commits}
Stars: ${stars}
Followers: ${userResponse.data.followers}

https://github.com/VickeKatt`
    });

    console.log(
      `GitHub stats command executed by ${command.user_name}`
    );
  } catch (err) {
    console.error("GitHub API error:", err);

    await respond({
      text: "Failed to fetch GitHub statistics."
    });
  }
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