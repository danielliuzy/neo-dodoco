import { ActivityType, ChannelType, Client, Partials } from "discord.js";
import { config } from "dotenv";
import { connect as connectMongoose } from "mongoose";
import { join } from "path";
import { startBdayJob } from "./bday";
import { getTextChannel, testDeployment } from "./utils";
import { sendWelcomeMessage } from "./welcome";

config();

export const guildId = process.env.GUILD_ID;
export const bdayChannelId = process.env.BDAY_CHANNEL_ID;
export const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
export const testChannelId = process.env.TEST_CHANNEL_ID;
export const testUserId = process.env.TEST_USER_ID;

export const font = join(__dirname, "fonts/ja-jp.ttf");
export const bdayImage = join(__dirname, "images/paimonBday.jpg");
export const welcomeImage = join(__dirname, "images/genshinWelcome.jpg");

const mongoSrv = process.env.MONGO_SRV;
connectMongoose(mongoSrv, {
  wtimeoutMS: 2500,
})
  .then(() => {
    console.log("Connected to database");
    client.login(process.env.TOKEN);
  })
  .catch((e) => {
    console.error(e);
  });

export const client = new Client({
  intents: [
    "Guilds",
    "GuildMembers",
    "GuildScheduledEvents",
    "DirectMessages",
    "GuildMessages",
  ],
  partials: [Partials.Channel],
});

client.on("ready", () => {
  console.log("neododoco online");
  client.user?.setActivity("Qixing", {
    type: ActivityType.Listening,
  });
  testDeployment();
  startBdayJob();
});

client.on("guildMemberAdd", (member) => {
  if (member.guild.id === guildId && !member.user.bot) {
    const welcomeChannel = getTextChannel(welcomeChannelId);
    if (welcomeChannel != null) {
      sendWelcomeMessage(member.id, welcomeChannel);
    }
  }
});
