import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./BookDetailPage.css";
import BOOK_API_KEY from "../bookApiKey";

const API_KEY = BOOK_API_KEY;
const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

const BookDetailPage = () => {
  const { id } = useParams(); // book id passed in route
  const navigate = useNavigate();
  const { user, addToReadLater, removeFromReadLater, getReadLater } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInReadLater, setIsInReadLater] = useState(false);

  useEffect(() => {
    const fetchBookDetail = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${BASE_URL}/${id}?key=${API_KEY}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error("Failed to fetch book detail:", err);
        setError("Could not load book details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [id]);

  // Check if book is in read later on mount and when book changes
  useEffect(() => {
    if (book && user) {
      const readLater = getReadLater();
      setIsInReadLater(readLater.some(item => item.id === book.id));
    }
  }, [book, user, getReadLater]);

  // Handle adding/removing from read later
  const handleReadLaterToggle = () => {
    if (!book || !user) return;
    
    const { volumeInfo } = book;
    
    if (isInReadLater) {
      // Remove from read later
      const result = removeFromReadLater(book.id);
      if (result.success) {
        setIsInReadLater(false);
      }
    } else {
      // Add to read later
      const bookData = {
        id: book.id,
        title: volumeInfo.title,
        authors: volumeInfo.authors,
        imageLinks: volumeInfo.imageLinks
      };
      const result = addToReadLater(bookData);
      if (result.success) {
        setIsInReadLater(true);
      }
    }
  };

  if (loading) return <p className="loading-text">Loading book details...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!book) return null;

  const { volumeInfo } = book;
  const title = volumeInfo.title || "No Title";
  const authors = volumeInfo.authors?.join(", ") || "Unknown Author";
  const description = volumeInfo.description || "No description available.";
  const coverImage = (
    volumeInfo.imageLinks?.thumbnail ||
    volumeInfo.imageLinks?.smallThumbnail ||
    "https://placehold.co/200x300"
  ).replace(/^http:/, 'https:');
  const googleBooksLink = volumeInfo.previewLink || volumeInfo.infoLink;

  return (
    <div className="book-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <div className="book-detail-content">
        <div className="book-detail-cover">
          <img src={coverImage} alt={title} />
        </div>

        <div className="book-detail-info">
          <h1>{title}</h1>
          <h3>By: {authors}</h3>
          <button 
            onClick={handleReadLaterToggle}
            className={`read-later-btn ${isInReadLater ? 'in-readlater' : ''}`}
          >
            {isInReadLater ? '✓ In Read Later' : '+ Add to Read Later'}
          </button>
          <p dangerouslySetInnerHTML={{ __html: description }}></p>
          {googleBooksLink && (
            <a
              href={googleBooksLink}
              target="_blank"
              rel="noopener noreferrer"
              className="read-book-btn"
            >
              Read Book
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
