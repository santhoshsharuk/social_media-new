
// FIX: Changed imports to use Firebase v9 compat layer to support v8 namespaced API.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

import { firebaseConfig } from "./firebaseConfig";
import { Post, User, Chat, Message, UserRole, Comment } from "../types";

// FIX: Initialized Firebase using v8 syntax.
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// FIX: Updated user type to firebase.User for v8 compatibility.
const formatUser = async (firebaseUser: firebase.User): Promise<User> => {
  // FIX: Used v8 syntax for Firestore document access.
  const userDocRef = db.collection("users").doc(firebaseUser.uid);
  const userDoc = await userDocRef.get();
  const userData = userDoc.data();
  
  // Use Google photoURL if available, otherwise use existing or fallback
  const photoURL = firebaseUser.photoURL || userData?.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`;
  
  // Update Firebase user document with Google photoURL if it exists and is different
  if (firebaseUser.photoURL && (!userData?.photoURL || userData.photoURL !== firebaseUser.photoURL)) {
    await userDocRef.update({
      photoURL: firebaseUser.photoURL
    });
  }
  
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || userData?.name || 'Anonymous',
    email: firebaseUser.email || '',
    photoURL,
    bio: userData?.bio || "Building the future, one line of code at a time.",
    role: userData?.role || 'user',
    goals: userData?.goals || [],
    following: userData?.following || [],
    followers: userData?.followers || [],
  };
};

// FIX: Updated type to firebase.firestore.DocumentSnapshot for type safety with v8.
const formatPost = (doc: firebase.firestore.DocumentSnapshot): Post => {
    const data = doc.data()!;
    return {
        id: doc.id,
        authorId: data.authorId,
        authorName: data.authorName,
        authorPhotoURL: data.authorPhotoURL,
        content: data.content,
        mediaURL: data.mediaURL,
        mediaType: data.mediaType,
        // FIX: Used v8 Timestamp type.
        createdAt: (data.createdAt as firebase.firestore.Timestamp)?.toDate() || new Date(),
        likes: data.likes || [],
        likesCount: data.likesCount || 0,
        commentsCount: data.commentsCount || 0,
        sharesCount: data.sharesCount || 0,
    }
}

const formatComment = (doc: firebase.firestore.DocumentSnapshot): Comment => {
    const data = doc.data()!;
    return {
        id: doc.id,
        postId: data.postId,
        authorId: data.authorId,
        authorName: data.authorName,
        authorPhotoURL: data.authorPhotoURL,
        text: data.text,
        createdAt: (data.createdAt as firebase.firestore.Timestamp)?.toDate() || new Date(),
    }
}

const api = {
  // Auth
  // FIX: Rewrote signup to use v8 auth and firestore APIs.
  async signup(name: string, email: string, password?: string): Promise<User> {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password || Math.random().toString(36).slice(-8));
    if (!userCredential.user) {
        throw new Error("User creation failed");
    }
    const photoURL = `https://i.pravatar.cc/150?u=${userCredential.user.uid}`;
    await userCredential.user.updateProfile({ displayName: name, photoURL });
    
    const userRef = db.collection("users").doc(userCredential.user.uid);
    const newUserProfile = {
        name,
        email,
        photoURL,
        bio: "New to Productive Bharat! Excited to connect and grow.",
        role: 'user' as UserRole,
        goals: [],
        following: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    await userRef.set(newUserProfile);
    
    return formatUser(userCredential.user);
  },

  // FIX: Rewrote login to use v8 auth API.
  async login(email: string, password?: string): Promise<User> {
    const userCredential = await auth.signInWithEmailAndPassword(email, password || 'password123');
    if (!userCredential.user) {
        throw new Error("Login failed");
    }
    return formatUser(userCredential.user);
  },

  // Google Sign-In
  async loginWithGoogle(): Promise<User> {
    const provider = new firebase.auth.GoogleAuthProvider();
    const userCredential = await auth.signInWithPopup(provider);
    if (!userCredential.user) {
      throw new Error("Google login failed");
    }
    
    // Check if user exists in Firestore, create if not
    const userDocRef = db.collection("users").doc(userCredential.user.uid);
    const userDoc = await userDocRef.get();
    
    if (!userDoc.exists) {
      // Create new user document for first-time Google login
      const newUserProfile = {
        name: userCredential.user.displayName || 'User',
        email: userCredential.user.email || '',
        photoURL: userCredential.user.photoURL || '',
        bio: "New to Productive Bharat! Excited to connect and grow.",
        role: 'user' as UserRole,
        goals: [],
        following: [],
        followers: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      await userDocRef.set(newUserProfile);
    }
    
    return formatUser(userCredential.user);
  },

  // FIX: Rewrote logout to use v8 auth API.
  logout: () => auth.signOut(),

  // Posts
  // FIX: Rewrote getPosts to use v8 firestore API.
  async getPosts(): Promise<Post[]> {
    const postsQuery = db.collection("posts").orderBy("createdAt", "desc").limit(50);
    const querySnapshot = await postsQuery.get();
    return querySnapshot.docs.map(formatPost);
  },

  // FIX: Rewrote createPost to use v8 firestore API.
  async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'authorPhotoURL' | 'authorName' | 'likes' | 'likesCount' | 'commentsCount' | 'sharesCount'>): Promise<Post> {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

    const docRef = await db.collection("posts").add({
        ...postData,
        authorName: user.displayName,
        authorPhotoURL: user.photoURL,
        likes: [],
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    const newDoc = await docRef.get();
    return formatPost(newDoc);
  },

  // Delete post
  async deletePost(postId: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    // Get post to verify ownership
    const postDoc = await db.collection("posts").doc(postId).get();
    if (!postDoc.exists) throw new Error("Post not found");
    
    const postData = postDoc.data();
    if (postData?.authorId !== user.uid) {
      throw new Error("You can only delete your own posts");
    }

    // Delete all comments for this post
    const commentsQuery = await db.collection("comments").where("postId", "==", postId).get();
    const commentDeletePromises = commentsQuery.docs.map(doc => doc.ref.delete());
    await Promise.all(commentDeletePromises);

    // Delete the post
    await db.collection("posts").doc(postId).delete();
  },

  // Users & Admins
  // FIX: Rewrote getAdmins to use v8 firestore API.
  async getAdmins(): Promise<User[]> {
    const adminsQuery = db.collection('users').where('role', '==', 'admin');
    const snapshot = await adminsQuery.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  },

  // FIX: Rewrote follow to use v8 firestore API.
  async follow(userId: string, adminId: string): Promise<void> {
    const batch = db.batch();
    
    // Add adminId to user's following array
    const userRef = db.collection('users').doc(userId);
    batch.update(userRef, {
        following: firebase.firestore.FieldValue.arrayUnion(adminId)
    });
    
    // Add userId to admin's followers array
    const adminRef = db.collection('users').doc(adminId);
    batch.update(adminRef, {
        followers: firebase.firestore.FieldValue.arrayUnion(userId)
    });
    
    await batch.commit();
  },

  // FIX: Rewrote unfollow to use v8 firestore API.
  async unfollow(userId: string, adminId: string): Promise<void> {
    const batch = db.batch();
    
    // Remove adminId from user's following array
    const userRef = db.collection('users').doc(userId);
    batch.update(userRef, {
        following: firebase.firestore.FieldValue.arrayRemove(adminId)
    });
    
    // Remove userId from admin's followers array
    const adminRef = db.collection('users').doc(adminId);
    batch.update(adminRef, {
        followers: firebase.firestore.FieldValue.arrayRemove(userId)
    });
    
    await batch.commit();
  },

  // FIX: Rewrote updateUserGoals to use v8 firestore API.
  async updateUserGoals(userId: string, goals: string[]): Promise<void> {
      const userRef = db.collection('users').doc(userId);
      await userRef.update({ goals });
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: { name?: string; bio?: string; photoURL?: string }): Promise<void> {
    const userRef = db.collection('users').doc(userId);
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.bio !== undefined) updateData.bio = updates.bio;
    if (updates.photoURL !== undefined) updateData.photoURL = updates.photoURL;
    
    await userRef.update(updateData);
    
    // Also update Firebase Auth profile
    const user = auth.currentUser;
    if (user) {
      const authUpdates: any = {};
      if (updates.name !== undefined) authUpdates.displayName = updates.name;
      if (updates.photoURL !== undefined) authUpdates.photoURL = updates.photoURL;
      
      if (Object.keys(authUpdates).length > 0) {
        await user.updateProfile(authUpdates);
      }
    }
  },

  // Chat
  // FIX: Rewrote getChatsForUser to use v8 firestore API.
  async getChatsForUser(userId: string): Promise<Chat[]> {
      const chatsQuery = db.collection('chats').where('participantIds', 'array-contains', userId);
      const snapshot = await chatsQuery.get();
      
      const chatPromises = snapshot.docs.map(async (docSnap) => {
          const chatData = docSnap.data();
          // FIX: Used v8 firestore API to fetch participant documents.
          const participantPromises = chatData.participantIds.map((id: string) => db.collection('users').doc(id).get());
          const participantDocs = await Promise.all(participantPromises);
          const participants = participantDocs.map(pDoc => ({ id: pDoc.id, ...pDoc.data() } as User));
          
          const messages = (chatData.messages || []).map((msg: any, index: number) => ({
              ...msg,
              id: msg.id || `${docSnap.id}-${index}`,
              // FIX: Used v8 Timestamp type.
              timestamp: (msg.timestamp as firebase.firestore.Timestamp)?.toDate() || new Date()
          })).sort((a: Message, b: Message) => a.timestamp.getTime() - b.timestamp.getTime());
          
          return {
              id: docSnap.id,
              participants: participants as [User, User],
              messages
          };
      });

      return Promise.all(chatPromises);
  },

  // FIX: Rewrote sendMessage to use v8 firestore API.
  async sendMessage(chatId: string, messageData: { senderId: string, text: string }): Promise<Message> {
      const chatRef = db.collection('chats').doc(chatId);
      const messageWithTimestamp = {
          ...messageData,
          id: new Date().toISOString() + Math.random(),
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };
      
      await chatRef.update({
          messages: firebase.firestore.FieldValue.arrayUnion(messageWithTimestamp)
      });
      
      return {
          ...messageData,
          id: messageWithTimestamp.id,
          timestamp: new Date()
      };
  },
  
  // FIX: Rewrote uploadFile to use v8 storage API.
  // Now supports both Firebase Storage and Cloudinary
  async uploadFile(file: File): Promise<string> {
    // Check which storage provider to use (see services/storageConfig.ts)
    const { STORAGE_CONFIG } = await import('./storageConfig');
    
    if (STORAGE_CONFIG.provider === 'cloudinary') {
      // Use Cloudinary (25 GB free, no CORS issues)
      const { uploadToCloudinary, isCloudinaryConfigured } = await import('./cloudinary');
      
      if (!isCloudinaryConfigured()) {
        throw new Error(
          'Cloudinary not configured. Update CLOUDINARY_CONFIG.cloudName in services/cloudinary.ts'
        );
      }
      
      return uploadToCloudinary(file);
    } else {
      // Use Firebase Storage (5 GB free, needs CORS config)
      const storageRef = storage.ref(`uploads/${Date.now()}_${file.name}`);
      const snapshot = await storageRef.put(file);
      return snapshot.ref.getDownloadURL();
    }
  },

  // Like/Unlike Post
  async toggleLike(postId: string, userId: string): Promise<void> {
    const postRef = db.collection('posts').doc(postId);
    const postDoc = await postRef.get();
    const likes = postDoc.data()?.likes || [];
    
    if (likes.includes(userId)) {
      // Unlike
      await postRef.update({
        likes: firebase.firestore.FieldValue.arrayRemove(userId),
        likesCount: firebase.firestore.FieldValue.increment(-1)
      });
    } else {
      // Like
      await postRef.update({
        likes: firebase.firestore.FieldValue.arrayUnion(userId),
        likesCount: firebase.firestore.FieldValue.increment(1)
      });
    }
  },

  // Comments
  async getComments(postId: string): Promise<Comment[]> {
    const commentsQuery = db.collection('comments')
      .where('postId', '==', postId)
      .orderBy('createdAt', 'desc')
      .limit(50);
    const snapshot = await commentsQuery.get();
    return snapshot.docs.map(formatComment);
  },

  async addComment(postId: string, text: string): Promise<Comment> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const commentData = {
      postId,
      authorId: user.uid,
      authorName: user.displayName || 'Anonymous',
      authorPhotoURL: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
      text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('comments').add(commentData);
    
    // Increment comments count
    await db.collection('posts').doc(postId).update({
      commentsCount: firebase.firestore.FieldValue.increment(1)
    });

    const newDoc = await docRef.get();
    return formatComment(newDoc);
  },

  // Share (increment counter)
  async incrementShareCount(postId: string): Promise<void> {
    await db.collection('posts').doc(postId).update({
      sharesCount: firebase.firestore.FieldValue.increment(1)
    });
  }
};


export { auth, db, storage, api, formatUser };