import { db } from './firebase';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

// ===== USER OPERATIONS =====
export async function createUser(uid, userData) {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid,
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      plan: 'free',
      createdAt: serverTimestamp(),
    });
  }
  return userRef;
}

export async function getUser(uid) {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
}

// ===== USAGE OPERATIONS =====
export async function getUserUsage(uid) {
  const usageRef = doc(db, 'usage', uid);
  const usageSnap = await getDoc(usageRef);
  
  if (!usageSnap.exists()) {
    await setDoc(usageRef, {
      uid,
      videosProcessed: 0,
      lastProcessed: null,
    });
    return { videosProcessed: 0 };
  }
  return usageSnap.data();
}

export async function incrementUsage(uid) {
  const usageRef = doc(db, 'usage', uid);
  const usageSnap = await getDoc(usageRef);
  
  if (!usageSnap.exists()) {
    await setDoc(usageRef, {
      uid,
      videosProcessed: 1,
      lastProcessed: serverTimestamp(),
    });
  } else {
    await updateDoc(usageRef, {
      videosProcessed: increment(1),
      lastProcessed: serverTimestamp(),
    });
  }
}

// ===== NOTES OPERATIONS =====
export async function saveNotes(uid, notesData) {
  const notesRef = collection(db, 'notes');
  const docRef = await addDoc(notesRef, {
    uid,
    videoId: notesData.videoId,
    videoTitle: notesData.videoTitle,
    videoUrl: notesData.videoUrl,
    notes: notesData.notes,
    language: notesData.language || 'en',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getUserNotes(uid) {
  const notesRef = collection(db, 'notes');
  const q = query(
    notesRef,
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getNotesById(noteId) {
  const noteRef = doc(db, 'notes', noteId);
  const noteSnap = await getDoc(noteRef);
  return noteSnap.exists() ? { id: noteSnap.id, ...noteSnap.data() } : null;
}
