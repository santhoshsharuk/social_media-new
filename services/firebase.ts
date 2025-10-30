
// FIX: Changed imports to use Firebase v9 compat layer to support v8 namespaced API.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

import { firebaseConfig } from "./firebaseConfig";
import { Post, User, Chat, Message, UserRole } from "../types";

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
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || userData?.name || 'Anonymous',
    email: firebaseUser.email || '',
    photoURL: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
    bio: userData?.bio || "Building the future, one line of code at a time.",
    role: userData?.role || 'user',
    goals: userData?.goals || [],
    following: userData?.following || [],
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
  async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'authorPhotoURL' | 'authorName'>): Promise<Post> {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

    const docRef = await db.collection("posts").add({
        ...postData,
        authorName: user.displayName,
        authorPhotoURL: user.photoURL,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    const newDoc = await docRef.get();
    return formatPost(newDoc);
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
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
        following: firebase.firestore.FieldValue.arrayUnion(adminId)
    });
  },

  // FIX: Rewrote unfollow to use v8 firestore API.
  async unfollow(userId: string, adminId: string): Promise<void> {
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
        following: firebase.firestore.FieldValue.arrayRemove(adminId)
    });
  },

  // FIX: Rewrote updateUserGoals to use v8 firestore API.
  async updateUserGoals(userId: string, goals: string[]): Promise<void> {
      const userRef = db.collection('users').doc(userId);
      await userRef.update({ goals });
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
  async uploadFile(file: File): Promise<string> {
    const storageRef = storage.ref(`uploads/${Date.now()}_${file.name}`);
    const snapshot = await storageRef.put(file);
    return snapshot.ref.getDownloadURL();
  }
};


export { auth, db, storage, api, formatUser };