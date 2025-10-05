# Project Blueprint: Full-Stack Movie Recommendation App

## 1. Overview

This document outlines the plan to transform the existing frontend application into a full-stack, visually revamped, and feature-rich movie recommendation website. The new application will use Firebase for backend services and MUI for a modern user interface.

## 2. Core Technologies

- **Frontend:** React, React Router
- **UI Framework:** MUI (Material-UI)
- **Backend:** Firebase (Authentication, Firestore)
- **API:** The Movie Database (TMDB)

## 3. Implemented Features and Design

### Current State (Before Transformation)

- **UI:** Basic HTML and CSS, not responsive.
- **Functionality:**
  - User can select language and genre preferences, which are saved to `localStorage`.
  - Movies are fetched from the TMDB API based on these preferences.
  - A basic chat page is available.
- **Authentication:** None.

### New Implementation (The Plan)

#### Phase 1: UI Overhaul & MUI Integration

- **Design System:**
  - **Colors:** A modern, dark-themed palette with vibrant accent colors for an energetic feel.
  - **Typography:** Clean and readable fonts (e.g., Montserrat) with clear hierarchy.
  - **Layout:** Responsive and intuitive layouts using MUI's grid system.
  - **Components:** All interactive elements (buttons, forms, navigation) will be replaced with their MUI counterparts for a polished and consistent look.
- **Pages to be Revamped:**
  - `LoginPage`
  - `SignupPage`
  - `PreferencePage`
  - `MoviesPage`
  - `MovieDetailPage`
  - `ChatPage`

#### Phase 2: Full-Stack Firebase Integration

- **Firebase Setup:**
  - **Authentication:** Enable Email/Password sign-in.
  - **Firestore:** Set up a `users` collection to store user data.
- **Data Model (`users` collection):**
  ```json
  {
    "uid": "firebase_auth_uid",
    "email": "user@example.com",
    "preferences": {
      "language": "en",
      "genre": "28"
    }
  }
  ```
- **Functionality:**
  - **User Registration:** On sign-up, a new user document will be created in Firestore.
  - **Login:** Users will be authenticated against Firebase Auth.
  - **Preference Management:** Preferences will be saved to and fetched from the user's Firestore document.

#### Phase 3: New Features & Functionality

- **Profile Page:**
  - **Route:** `/profile`
  - **Features:**
    - Display user's email.
    - Allow users to update their language and genre preferences.
    - A "Logout" button.
- **Navigation:**
  - An `AppBar` component from MUI will be used for consistent navigation.
  - A user profile icon in the `AppBar` will link to the new `ProfilePage`.

## 4. Current Task: Initial Setup

The current step is to set up the foundational elements for this transformation.

- **Objective:** Prepare the project for MUI integration and Firebase setup.
- **Steps:**
  1. **Install MUI:** Add `@mui/material`, `@emotion/react`, and `@emotion/styled` to the project dependencies.
  2. **Initialize Firebase:** Set up Firebase in the project, enabling Authentication and Firestore.
  3. **Create Firebase Config:** Create a `firebase.js` file to hold the Firebase configuration and export the necessary services.
  4. **Theme Provider:** Wrap the main `App` component in MUI's `ThemeProvider` to enable custom theming.
