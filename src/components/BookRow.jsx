import React from "react";
import { useNavigate } from "react-router-dom";
import "./BookRow.css";

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const { volumeInfo } = book;
  const title = volumeInfo.title || "No Title";
  const imageUrl = (
    volumeInfo.imageLinks?.thumbnail ||
    volumeInfo.imageLinks?.smallThumbnail ||
    "https://via.placeholder.com/200x300"
  ).replace(/^http:/, 'https:');

  const handleClick = () => {
    navigate(`/books/${book.id}`); // Navigate to BookDetailPage
  };

  return (
    <div className="book-row-card" onClick={handleClick}>
      <img src={imageUrl} alt={title} />
      <div className="book-row-card-info">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

const BookRow = ({ title, books }) => {
  const validBooks = books.filter(book => book && book.volumeInfo);

  return (
    <div className="book-row-container">
      <h2>{title}</h2>
      <div className="book-row-scroll-container">
        <div className="book-row">
          {validBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookRow;
