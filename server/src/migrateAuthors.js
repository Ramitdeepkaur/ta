
import mongoose from 'mongoose';
import { Book } from './models/book.model.js'; 
import { Author } from './models/author_model.js';

async function migrateAuthors() {
  await mongoose.connect("mongodb+srv://armaansaini20:armaan123@cluster0.b13is.mongodb.net/?retryWrites=true&w=majority&appName=Cluster");

  const books = await Book.find();
  const authorMap = new Map();

  for (const book of books) {
    const authorName = book.author;

    if (!authorName) continue;

    if (!authorMap.has(authorName)) {
      let authorDoc = await Author.findOne({ name: authorName });

      if (!authorDoc) {
        authorDoc = new Author({ name: authorName });
        await authorDoc.save();
      }

      authorMap.set(authorName, authorDoc._id);
    }


    book.author = authorMap.get(authorName);
    await book.save();
  }

  console.log("✅ Migration completed successfully.");
  mongoose.disconnect();
}

migrateAuthors().catch(err => {
  console.error("❌ Migration failed:", err);
});
