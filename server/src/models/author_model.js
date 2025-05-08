import mongoose from "mongoose";
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  bio: String,
  nationality: String,
  birthDate: Date,
});

export const Author=  mongoose.model("Author", authorSchema);