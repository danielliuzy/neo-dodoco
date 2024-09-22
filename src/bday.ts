import { createCanvas, loadImage, registerFont } from "canvas";
import { CronJob } from "cron";
import { AttachmentBuilder, EmbedBuilder, TextChannel } from "discord.js";
import {
  bdayChannelId,
  bdayImage,
  font,
  testChannelId,
  testUserId,
} from "./index";
import Bday from "./models/Bday";
import { getGuild, getTextChannel } from "./utils";

export const sendBdayMessage = async (userId: string, channel: TextChannel) => {
  const canvasWidth = 850;
  const canvasHeight = 510;
  const avatarHeight = 230;
  registerFont(font, { family: "ja-jp" });
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const context = canvas.getContext("2d");
  const backgroundImage = await loadImage(bdayImage);
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  context.font = "72px ja-jp";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.shadowColor = "black";
  context.shadowBlur = 10;
  context.lineWidth = 8;
  var ctext = "HAPPY BIRTHDAY";
  context.fillText(ctext, canvas.width / 2, canvas.height * 0.85);
  context.shadowBlur = 0;
  context.fillStyle = "white";
  context.fillText(ctext, canvas.width / 2, canvas.height * 0.85);

  context.beginPath();
  context.arc(
    canvas.width / 2,
    canvas.height / 2 - 75,
    avatarHeight / 2,
    0,
    Math.PI * 2,
    true
  );
  context.closePath();
  context.clip();

  const guild = getGuild();
  if (guild == null) {
    return;
  }
  const user = await guild.members.fetch(userId);
  const avatar = await loadImage(user.displayAvatarURL({ extension: "jpg" }));
  context.drawImage(
    avatar,
    canvas.width / 2 - avatarHeight / 2,
    canvas.height / 2 - avatarHeight / 2 - 75,
    avatarHeight,
    avatarHeight
  );
  const attachment = new AttachmentBuilder(canvas.toBuffer(), {
    name: "happyBday.png",
  });
  const embed = new EmbedBuilder()
    .setColor(user.displayHexColor)
    .setTitle("🎂 HAPPY BIRTHDAY 🎂")
    .setDescription(
      `Everyone wish <@${userId}> a happy birthday! <:klee_heart:965992961064177754>`
    )
    .setImage("attachment://happyBday.png")
    .setFooter({
      text: "Use /bday to register/update your birthday. Use /forget to remove your birthday.",
    });
  channel.send({ embeds: [embed], files: [attachment] });
};

export const startBdayJob = () => {
  new CronJob(
    "1 0 * * *",
    async () => {
      const date = new Date();
      let monthNow = date.getMonth() + 1;
      let dayNow = date.getDate();
      const query = {
        month: { $eq: monthNow },
        day: { $eq: dayNow },
      };
      const bdayChannel = getTextChannel(bdayChannelId);
      if (bdayChannel == null) {
        return;
      }
      try {
        const bdays = await Bday.find(query);
        bdays.forEach((bday) => {
          if (bday.userId != null) {
            void sendBdayMessage(bday.userId, bdayChannel);
          }
        });
        const testChannel = getTextChannel(testChannelId);
        if (testChannel == null) {
          return;
        }
        testChannel.send("Test message for cron...");
        void sendBdayMessage(testUserId, testChannel);
      } catch (e) {
        console.error(e);
      }
    },
    null,
    true,
    "America/Los_Angeles"
  ).start();
};
