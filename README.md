# Twitter Clone
This project is a Twitter clone built with the MERN stack (MongoDB, Express.js, React, Node.js). It replicates core Twitter features such as user authentication, posting tweets, following users, liking, and commenting. The goal is to provide a hands-on experience in full-stack development using modern technologies.

Check out the result - https://twitter-clone-wj5r.onrender.com/

*Note- Username = vivek7156 and password = 12345678

![Screenshot 2024-10-20 115229](https://github.com/user-attachments/assets/1f145170-d43b-4ebd-b474-b8c77f23bc9a)

![Screenshot 2024-10-20 115247](https://github.com/user-attachments/assets/5d11f5ec-44ac-49c7-aad1-e3f57eaa2c86)


## Features
User Authentication: Sign up, log in, and log out with JWT-based authentication.

Profile Management: Edit user profiles with profile pictures, bios, and other details.

Tweeting: Create, edit, and delete tweets.


Likes & Comments: Like tweets and leave comments.

Follow/Unfollow: Follow or unfollow other users.

Responsive Design: Mobile-friendly layout using modern CSS frameworks.

## Tech Stack
### Frontend - 
React: Frontend JavaScript library for building user interfaces.

React Router: For client-side routing.

Axios: For making HTTP requests to the backend.

React Query: For data fetching and state management.

Tailwind CSS: Utility-first CSS framework for styling.

### Backend - 
Node.js: JavaScript runtime for the backend.

Express.js: Web framework for building the backend API.

MongoDB: NoSQL database for data storage.

Mongoose: MongoDB object modeling for Node.js.

JWT (JSON Web Token): For user authentication and authorization.

## Installation
### Clone the repository
git clone https://github.com/your-username/twitter-clone.git

cd twitter-clone

### Install dependencies
npm install
and 
cd frontend
npm install

### Configuration
Create a .env file
// MongoDB connection string

MONGO_URI=mongodb+srv://<your-username>:<your-password>@cluster0.mongodb.net/twitter-db?retryWrites=true&w=majority

// Port for the backend server

PORT=5000

// JWT secret for authentication

JWT_SECRET=your_jwt_secret

// Node environment

NODE_ENV=development

// Cloudinary configuration for image uploads

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_cloudinary_api_key

CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Add .env to .gitignore to avoid committing sensitive information

## Running the project
Backend -

    cd backend
    
    npm run dev
Frontend - 

    cd frontend
    
    npm run dev
The React app should now be running at http://localhost:3000.

## API endpoints
User

POST /api/user/signup - Register a new user

POST /api/user/login - Login a user

GET /api/user/me - Get user profile


Tweets

POST /api/post/create - Create a tweet

GET /api/post/all - Get all tweets

DELETE /api/post/:id - Delete a tweet

## Technologies Used
Frontend: React, Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB Atlas

Cloud Storage: Cloudinary

Authentication: JWT

## Contact
### For any questions or suggestions, please reach out to me.
