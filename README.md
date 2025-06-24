![Image](https://github.com/user-attachments/assets/4f76a9b3-d780-47a9-a659-ea13c8a0346b)
# Community Travel Planning Platform

TripEase is a comprehensive Group travel planning platform that helps users organize trips, collaborate with fellow travelers, and share experiences. The platform features trip management, activity planning, place recommendations, and social interaction capabilities.

## Features

- **Trip Management**: Create and manage trips with detailed information
- **Collaborative Planning**: Invite members and plan trips together
- **Activity Organization**: Schedule and manage activities within trips
- **Place Management**: Add and organize places to visit
- **Social Features**: Share experiences, comment on activities
- **User Authentication**: Secure user registration and authentication
- **Real-time Updates**: Instant updates for trip changes
- **Experience Sharing**: Share and discover travel experiences

## Tech Stack

### Frontend
- React with TypeScript
- Vite as build tool
- Tailwind CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose ODM

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Project Structure

```
tripease/
├── Project/           # Frontend application
│   ├── src/
│   ├── public/
│   └── package.json
└── Server/           # Backend application
    ├── models/
    ├── routes/
    └── package.json
```

## Setup Instructions

### Backend Setup

1. Navigate to the Server directory:
   ```bash
   cd Server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the Server directory with the following variables:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/tripease
   PORT=3000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the Project directory:
   ```bash
   cd Project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the Project directory with necessary environment variables:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

The backend provides RESTful APIs for:

- User Authentication (/sign-in, /sign-up)
- Trip Management (/trips)
- Activity Management (/activities)
- Place Management (/places)
- Experience Sharing (/experiences)
- Comments and Interactions (/comments)

## Database Models

- Users: User profiles and authentication
- Trips: Trip details and planning
- Activities: Scheduled activities within trips
- Places: Location information
- Comments: User interactions and discussions
- Experiences: Shared travel experiences

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Support

For support, email tripeaseplatform@gmail.com or create an issue in the repository.
# react-vite-deploy
