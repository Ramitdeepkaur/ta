import express from 'express'; 
import { Book } from '../models/book.model.js';

const router = express.Router();

router.get("/new/outofstock", async (req, res) => {
    try {
      const outOfStockBooks = await Book.find({ copies: 0 });
      res.status(200).json({ success: true, data: outOfStockBooks });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
  router.get('/new/low-stock',async(req,res)=>{
    try{
        
        const lowbooks = await Book.find({ copies:{$gt:0 ,$lt:10 }});
        res.status(200).json({data:lowbooks});
    }catch(error){
        res.status(500).json({ error: "Failed to fetch low-stock books" });
    }
});


router.get('/best-selling-book', async (req, res) => {
    try {
      const bestBook = await Book.findOne().sort({ sold: -1 }).limit(1);
  
      if (!bestBook) {
        return res.status(404).json({ message: 'No books found.' });
      }
  
      res.status(200).json({ bestSellingBook: bestBook });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching best selling book', error: error.message });
    }
  });
router.get('/best-selling-author', async (req, res) => {
  try {
    const result = await Book.aggregate([
      {
        $group: {
          _id: '$author',
          totalSold: { $sum: '$sold' }
        }
      },
      {
        $sort: { totalSold: -1 }
      },
      {
        $limit: 1
      }
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No authors found.' });
    }

    res.status(200).json({ bestSellingAuthor: result[0]._id, totalSold: result[0].totalSold });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching best selling author', error: error.message });
  }
});


router.post('/', async (req, res) => {
    try {
      const { title, author, publishYear, price, copies, sold } = req.body;
  
      if (!title || !author || !publishYear || !price || copies === undefined) {
        return res.status(400).send({ message: 'Please fill in all the fields' });
      }
  
      const newBook = {
        title,
        author,
        publishYear,
        price,
        copies,
        sold: sold || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
  
      const result = await Book.collection.insertOne(newBook);
  
      return res.status(201).json({
        message: 'Book inserted successfully',
        book: newBook  
      });
  
    } catch (error) {
      console.error('Error inserting book:', error);
      return res.status(500).send({ message: 'Error inserting book', error: error.message });
    }
  });
// Route to get all books from database
router.get('/', async (request, response) => {
    try {
        const books = await Book.find({})
        return response.status(200).json({
            count: books.length,
            data: books
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to get one book by ID
router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const objectId = new mongoose.Types.ObjectId(id);
  
      const book = await Book.collection.findOne({ _id: objectId });
  
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      return res.status(200).json(book);
    } catch (error) {
      console.error('Error fetching book by ID:', error.message);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
  

// Route to update a book
router.put('/:id', async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear ||
            !request.body.sold||
            request.body.copies === undefined
        ) {
            return response.status(400).send({
                message: "Please fill in all the fields"
            });
        }

        const { id } = request.params;
        const result = await Book.findByIdAndUpdate(id, request.body, { new: true });
        if (!result) {
            return response.status(404).json({ message: "Book not found" });
        }
        return response.status(200).json({ message: "Book updated successfully", book: result });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

router.patch('/:id/copies', async (req, res) => {
    try {
      const { copies } = req.body;
  
      const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        { $inc: { copies: copies } },
        { new: true }
      );
  
      if (!updatedBook) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      // Ensure copies never go below 0
      if (updatedBook.copies < 0) {
        updatedBook.copies = 0;
        await updatedBook.save();
      }
  
      res.status(200).json({ message: 'Copies updated successfully', book: updatedBook });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating copies', error: error.message });
    }
  });
  
  router.patch('/:id/sold', async (req, res) => {
    try {
      const { sold } = req.body;
  
      if (!sold || sold === 0) {
        return res.status(400).json({ message: 'Invalid quantity' });
      }
  
      const update = sold > 0
        ? {
         
            filter: { _id: req.params.id, copies: { $gte: sold } },
            inc: { sold: sold, copies: -sold }
          }
        : {
        
            filter: { _id: req.params.id, sold: { $gte: Math.abs(sold) } },
            inc: { sold: sold, copies: -sold } 
          };
  
      const updatedBook = await Book.findOneAndUpdate(
        update.filter,
        { $inc: update.inc },
        { new: true }
      );
  
      if (!updatedBook) {
        return res.status(400).json({ message: 'Not enough stock/sold to adjust' });
      }
  
      res.status(200).json({ message: 'Sold count updated', book: updatedBook });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating sold', error: error.message });
    }
  });
  
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Book.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Book not found' });
        }

        return response.status(200).send({ message: 'Book deleted successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});



export default router;