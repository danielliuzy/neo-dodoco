import { createCanvas, loadImage, registerFont } from "canvas";
import { AttachmentBuilder, TextChannel } from "discord.js";
import { getGuild } from "./utils";

export const sendWelcomeMessage = async (
  userId: string,
  channel: TextChannel
) => {
  const canvasWidth = 850;
  const canvasHeight = 478;
  const avatarHeight = 200;
  registerFont("./fonts/ja-jp.ttf", { family: "ja-jp" });
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const context = canvas.getContext("2d");
  const backgroundImage = await loadImage("./images/genshinWelcome.jpg");
  context.globalAlpha = 1.0;
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  context.globalAlpha = 0.05;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.globalAlpha = 2.0;
  context.font = "64px ja-jp";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.shadowColor = "black";
  context.shadowBlur = 10;
  context.lineWidth = 8;
  let topText = "Welcome to";
  context.fillText(topText, canvas.width / 2, canvas.height * 0.15);
  context.shadowBlur = 0;
  context.fillStyle = "white";
  context.fillText(topText, canvas.width / 2, canvas.height * 0.15);
  context.shadowBlur = 10;
  let botText = "UCLA Genshin Impact!";
  context.fillText(botText, canvas.width / 2, canvas.height * 0.85);
  context.shadowBlur = 0;
  context.fillStyle = "white";
  context.fillText(botText, canvas.width / 2, canvas.height * 0.85);

  context.beginPath();
  context.arc(
    canvas.width / 2,
    canvas.height / 2,
    avatarHeight / 2,
    0,
    Math.PI * 2,
    true
  );
  context.closePath();
  context.clip();

  try {
    const guild = getGuild();
    if (guild == null) {
      return;
    }
    const user = await guild.members.fetch(userId);
    const avatar = await loadImage(user.displayAvatarURL({ extension: "jpg" }));
    context.drawImage(
      avatar,
      canvas.width / 2 - avatarHeight / 2,
      canvas.height / 2 - avatarHeight / 2,
      avatarHeight,
      avatarHeight
    );
    const attachment = new AttachmentBuilder(canvas.toBuffer());
    channel.send({
      content: `Welcome <@${userId}> to UCLA Genshin Impact!`,
      files: [attachment],
    });
  } catch (e) {
    console.error(e);
  }
};
