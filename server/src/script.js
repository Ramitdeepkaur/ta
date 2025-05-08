// fixAuthors.js
import mongoose from "mongoose";
import { Author } from "./models/author_model.js"; // adjust the path
import { Book } from "./models/book.model.js";     // adjust the path

// Connect to MongoDB
mongoose.connect("mongodb+srv://armaansaini20:armaan123@cluster0.b13is.mongodb.net/?retryWrites=true&w=majority&appName=Cluster", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log("Connected to MongoDB");

  const books = await Book.find();

  for (let book of books) {
    if (typeof book.author === 'string' && book.author !== "Unknown") {
      const author = await Author.findOne({ name: book.author.trim() });

      if (author) {
        book.author = author._id;
        await book.save();
        console.log(`✔ Updated book: ${book.title}`);
      } else {
        console.warn(`⚠ Author not found for book: ${book.title}`);
      }
    }
  }

  console.log("Done.");
  mongoose.disconnect();
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});
