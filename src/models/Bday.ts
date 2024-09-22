import { Schema, model } from "mongoose";

const Bday = new Schema({
  userId: String,
  month: Number,
  day: Number,
});

export default model("Bday", Bday);
