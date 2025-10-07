import React from 'react';
import './BookRow.css';

const BookCard = ({ book }) => {
  const { volumeInfo } = book;
  const title = volumeInfo.title || 'No Title';
  const imageUrl = volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || 'https://via.placeholder.com/200x300';

  return (
    <div className="book-row-card">
      <img src={imageUrl} alt={title} />
      <div className="book-row-card-info">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

const BookRow = ({ title, books }) => {
  if (!books || books.length === 0) return null;

  return (
    <div className="book-row-container">
      <h2>{title}</h2>
      <div className="book-row-scroll">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BookRow;
