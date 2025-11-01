/*
=========================================
Firebase Firestore Data Structure Example
=========================================

// Collection: users
// Purpose: Stores user profile information and role.
{
  "users": {
    "user_id_1": {
      "name": "Aarav Sharma",
      "email": "aarav@example.com",
      "photoURL": "url_to_photo.jpg",
      "bio": "Building the future, one line of code at a time.",
      "role": "user", // or "admin"
      "goals": ["Finish my novel", "Run a marathon"],
      "following": ["admin_id_1", "admin_id_2"], // List of admin IDs the user follows
      "createdAt": "timestamp"
    },
    "admin_id_1": {
       "name": "Admin Priya",
       "email": "priya.admin@example.com",
       "role": "admin",
       ...
    }
  }
}

// Collection: posts
// Purpose: Stores content created by admins.
{
  "posts": {
    "post_id_1": {
      "authorId": "admin_user_id",
      "authorName": "Admin Name",
      "authorPhotoURL": "url_to_admin_photo.jpg",
      "content": "Here's a motivational quote for your week!",
      "mediaURL": "url_to_image_or_video.jpg", // optional
      "mediaType": "image", // or "video"
      "createdAt": "timestamp"
    }
  }
}


// Collection: chats
// Purpose: Stores chat messages between two users.
{
  "chats": {
    "chat_doc_id": { // e.g., sorted user IDs like "user_id_1_user_id_2"
      "messages": [ // This could be a subcollection for scalability
        {
          "senderId": "user_id_1",
          "text": "Hello! Great to connect.",
          "timestamp": "timestamp"
        }
      ]
    }
  }
}

*/

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  bio: string;
  role: UserRole;
  goals: string[];
  following: string[]; // array of admin user IDs
  followers?: string[]; // array of user IDs who follow this user
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorPhotoURL: string;
  text: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoURL: string;
  content: string;
  mediaURL?: string;
  mediaType?: 'image' | 'video';
  createdAt: Date;
  likes: string[]; // Array of user IDs who liked the post
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface Chat {
    id: string; // Combination of two user IDs
    participants: [User, User];
    messages: Message[];
}

export type Page = 'feed' | 'chat' | 'profile' | 'admin' | 'users' | 'settings';

export type Theme = 'light' | 'dark';
