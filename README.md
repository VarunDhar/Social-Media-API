### BACKEND ASSIGNMENT FOR SPYNE ###
Follow Microservices architecture.
Tech-Stack - Node.js, Framework - Express, ORM - Mongoose, several NPM libraries (Bcrypt, Cloudinary, cookie-parser, jwt, axios)

### Overview ###

The API I have developed is to strengthen a comprehensive application designed to facilitate user interactions through discussions, comments, and notifications. It is built using a microservices architecture to ensure scalability, maintainability, and flexibility. Each microservice is responsible for a distinct aspect of the platform, including user management, discussions, comments, and notifications.

### Goals ###

User Management:

  User Registration and Login.
  
  Profile Management.
  
  User Search and Follow Functionality.
  
Discussion Management:

  Creation and Management of Discussions.
  
  Support for Text and Image Posts.
  
  Hashtag Integration for Easy Search and Categorization.
  
Commenting System:

  Comment on Discussions.
  
  Like and Reply to Comments.
  
  Nested Comments for Threads.
  
  
### Specifications ###

Backend:

  Node.js and Express.js for server-side logic.
  
  Mongoose for MongoDB object modeling.
  
  Cloudinary for image upload and storage.
  
  
Database:

  MongoDB for flexible and scalable data storage.
  
  Mongoose ORM is used to handle database-server requests.
  
  
Authentication:
  JSON Web Tokens (JWT) for secure authentication across services.

  Bcrypt (for encryption/decryption)
  Axios (for inter-services API calls)
  Multer (for form data and file upload)
  Cookie parser
  Body parser
