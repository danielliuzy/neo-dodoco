import { ChannelType } from "discord.js";
import {
  bdayChannelId,
  client,
  guildId,
  testChannelId,
  testUserId,
} from "./index";
import { sendBdayMessage } from "./bday";
import { sendWelcomeMessage } from "./welcome";

export const getGuild = () => {
  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    console.error("Target guild not found");
    return null;
  }
  return guild;
};

export const getTextChannel = (channelId: string) => {
  const guild = getGuild();
  const textChannel = guild?.channels.cache.get(channelId);
  if (textChannel == null || textChannel.type !== ChannelType.GuildText) {
    console.error(`channel ${channelId} not found`);
    return null;
  }
  return textChannel;
};

export const testDeployment = () => {
  const testChannel = getTextChannel(testChannelId);
  const date = new Date();
  testChannel?.send(
    `Deployment test at ${date.toLocaleString("en-US", { timeZone: "PST" })}`
  );
  if (testChannel != null) {
    sendBdayMessage(testUserId, testChannel);
    sendWelcomeMessage(testUserId, testChannel);
  }
};
