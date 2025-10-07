# Project Blueprint: Cinematic Universe - A Recommendation App

## 1. Overview

This document outlines the current state, design principles, and implemented features of the Cinematic Universe application. The app has been transformed from a basic frontend into a visually modern, feature-rich, and responsive web application. It provides personalized movie and book recommendations, leveraging the TMDB and Google Books APIs, with a sleek, dark-themed user interface and Firebase for user management.

## 2. Core Technologies

- **Frontend:** React, React Router, React Firebase Hooks
- **Backend:** Firebase (Authentication, Firestore)
- **Styling:** Custom CSS with a modern, responsive design system (Flexbox, Grid)
- **APIs:**
  - The Movie Database (TMDB) for movie data.
  - Google Books API for book data.
  - OpenAI for the chat functionality.
- **State Management:** React Hooks (`useState`, `useEffect`, `useContext`), Language Context API

## 3. Firebase Integration

- **Authentication:** Firebase Authentication is integrated for secure user signup and login. Users can create an account with their email and password, and their session is managed across the application.
- **Firestore Database:** User data, including preferences for movie language and genre, is stored in Firestore. This allows for a persistent, personalized experience for logged-in users.
- **User-Specific Data:** Each user has a dedicated document in Firestore where their preferences are saved. This data is fetched upon login and used to tailor the movie recommendations.

## 4. Application Design and Features

### Design System

- **Theme:** A sophisticated dark theme is used throughout the application to create a cinematic experience.
- **Primary Color:** A vibrant blue (`#00aaff`) is used as the primary accent color for buttons, links, highlights, and glowing effects.
- **Typography:** The 'Poppins' font is used for clean, modern, and readable text with a clear visual hierarchy.
- **Layout:** Responsive layouts are employed across all pages, ensuring a seamless experience on both desktop and mobile devices. Key elements include sticky navigation, flexible grids, and centered content.
- **Visual Effects:** The UI is enhanced with subtle animations, hover effects, box shadows, and gradient overlays to create a sense of depth and interactivity.

### Implemented Pages & Features

1.  **Main Navigation (`App.jsx`):
    - A sticky, blurred backdrop navigation bar provides access to all major sections of the app.
    - Features a distinct logo and links that highlight on hover and for the active page.
    - **Dynamic Authentication Link:** Displays a "Login" link for guests and a "Logout" button for authenticated users.

2.  **Login & Signup (`LoginPage.jsx`, `SignupPage.jsx`):
    - **Firebase Authentication:** Fully integrated with Firebase for user authentication.
    - Clean, centered forms with a glass-morphism effect.
    - Modern input fields and clear call-to-action buttons.

3.  **Movie Discovery (`MoviesPage.jsx`):
    - **Categorized Rows:** The page is structured into horizontally scrollable rows, each displaying a specific category of movies.
    - **MovieRow Component:** A reusable `MovieRow` component is used to display each category, ensuring a consistent and clean layout.
    - **Dynamic Content:** The movies displayed are tailored to the user's preferred language and genre, drawn from the following categories:
        - **Top Picks:** A personalized selection based on the user's genre preference.
        - **Trending Now:** The most popular movies of the week.
        - **Latest Releases:** Movies currently in theatres.
        - **Upcoming:** Films scheduled for future release.
    - **Hero Section:** The page opens with a dynamic hero component showcasing a top movie, featuring its backdrop image and a brief overview.
    - **Search:** A prominent search bar allows users to find movies, with results displayed in a dedicated row.
    - **Robust Error Handling:** The page now includes improved error handling for API and Firebase calls. If a backend service fails, a clear error message is displayed to the user, preventing the application from crashing and providing a better user experience.

4.  **Movie Details (`MovieDetailPage.jsx`):
    - An immersive detail view that uses the movie's backdrop as a full-bleed background.
    - A clear layout presents the movie poster, title, genres, runtime, rating, and overview.
    - Sections for the main cast and available streaming platforms (OTT) in the user's region.

5.  **Book Discovery (`BooksPage.jsx`):
    - **Dynamic, Multi-Section Layout:** Features a dynamic, multi-section layout with categorized, horizontally scrollable rows.
    - **Curated & Personalized Content:** The page is designed to display curated rows of books that respect the user's language preference. The content includes:
        - **Top Picks by Genre:** A personalized selection based on the user's saved book genre preference.
        - **Trending Now:** A collection of popular and bestselling books.
        - **Latest Releases:** The newest books to be published.
    - **Real-Time Preference Syncing:** The page is fully reactive. It listens for changes to the user's preferences (language and genre) in `localStorage` and automatically re-fetches content to reflect those changes in real-time, without needing a page refresh.
    - **Enhanced Search:** Search functionality is seamlessly integrated, with results appearing in their own dedicated row.
    - **[BLOCKER] Invalid API Key:** The page is currently non-functional and displays an error. The Google Books API key being used is invalid, and the page will not work until a valid key is provided.


6.  **AI Chat (`ChatPage.jsx`):
    - A redesigned chat interface for interacting with an AI assistant.
    - Messages are styled distinctly for the user and the AI, within a scrollable chat window.

7.  **User Preferences (`PreferencePage.jsx`):
    - **Enhanced Personalization:** The page has been redesigned to allow for more granular and independent user preferences for both movies and books.
    - **Dual Preference Sections:** The UI is now split into two distinct sections: "Movie Preferences" and "Book Preferences," each with its own language and genre selectors.
    - **Curated Genre Lists:** The genre selections for both movies and books now use curated, more effective lists to improve the quality of recommendations.
    - **Independent Selections:** Users can choose a separate language and genre for movies and books, providing a more tailored experience.
    - **Expanded Data Storage:** All four preferences (movie language/genre and book language/genre) are saved to Firebase for authenticated users or to local storage for guests, ensuring a persistent and highly personalized experience across the application.

## 5. Centralized Language Management

- **LanguageContext:** A `LanguageContext` has been implemented to manage the application's language state globally.
- **`App.jsx` Integration:** The entire application is wrapped with the `LanguageProvider`, making the language state accessible to all components.
- **`PreferencePage.jsx`:** The preferences page now uses the `setLanguage` function from the context, ensuring that language selections are reflected application-wide.
- **`MoviesPage.jsx`:** The movies page now consumes the `language` value from the context, automatically re-fetching movie data in the newly selected language.
