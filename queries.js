// all books in a specific genre
db.books.find({ genre: "Classic" });

// Books published after a certain year
db.books.find({ publishedYear: { $gt: 1950 } });

// books by a specific author
db.books.find({ author: "George Orwell" });


//Update the price of a specific book
db.books.updateOne({ title: "The Hobbit" }, { $set: { price: 25.99 } });
  

// Delete a book by its title
db.books.deleteOne({ title: "Animal Farm" });

// Find books that are both in stock and published after 2010
db.books.find({ inStock: true, publishedYear: { $gt: 2010 } });

// Use projection to return only title, author, and price
db.books.find(
  { inStock: true, publishedYear: { $gt: 2010 } },
  { title: 1, author: 1, price: 1, _id: 0 }
);

// Sorting by price by ascending order
db.books.find().sort({ price: 1 });

// Sorting by price by descending order
db.books.find().sort({ price: -1 });

// Pagination (5 books per page)
// Page 1
db.books.find().skip(0).limit(5);

// Page 2
db.books.find().skip(5).limit(5);

// Aggregation Pipeline
// 1. Calculate average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" },
    },
  },
]);

// 2. Find the author with the most books
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 },
    },
  },
  { $sort: { bookCount: -1 } },
  { $limit: 1 },
]);

// 3. Group books by publication decade and count them
db.books.aggregate([
  {
    $group: {
      _id: {
        $concat: [
          {
            $toString: {
              $multiply: [{ $floor: { $divide: ["$publishedYear", 10] } }, 10],
            },
          },
          "s",
        ],
      },
      count: { $sum: 1 },
    },
  },
  { $sort: { _id: 1 } },
]);

// Indexing
// 1. Create index on title
db.books.createIndex({ title: 1 });

// 2. Create compound index on author and publishedYear
db.books.createIndex({ author: 1, publishedYear: -1 });

// 3. Use explain() to compare query performance
// Without index:
db.books.find({ title: "The Hobbit" }).explain("executionStats");

// With index (after creating index):
db.books.createIndex({ title: 1 }); // run once if not created
db.books.find({ title: "The Hobbit" }).explain("executionStats");






