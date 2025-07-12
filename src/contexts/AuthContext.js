import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  async function signup(email, password, userData) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Update user profile with display name
      await updateProfile(user, {
        displayName: userData.clientName
      });

      // Store additional user data in Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: email,
          displayName: userData.clientName,
          phone: userData.phone,
          address: userData.address,
          city: userData.city,
          country: userData.country,
          zip: userData.zip,
          createdAt: new Date().toISOString()
        });
      } catch (firestoreError) {
        console.error('Error saving user data to Firestore:', firestoreError);
        // Don't throw error here, authentication was successful
        toast.warning('Account created but profile data could not be saved. Please try updating your profile later.');
      }

      toast.success('Account created successfully!');
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message);
      throw error;
    }
  }

  // Sign in function
  async function signin(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully!');
      return result;
    } catch (error) {
      console.error('Signin error:', error);
      toast.error(error.message);
      throw error;
    }
  }

  // Sign out function
  async function logout() {
    try {
      await signOut(auth);
      toast.success('Signed out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error.message);
      throw error;
    }
  }

  // Get user data from Firestore
  async function getUserData(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('User authenticated:', user.email, user.uid);
        // Get additional user data from Firestore
        const userData = await getUserData(user.uid);
        console.log('User data loaded:', userData);
        setCurrentUser({
          ...user,
          userData: userData
        });
      } else {
        console.log('User signed out');
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    signin,
    logout,
    getUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
