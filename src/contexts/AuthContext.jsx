import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

// List of authorized trainer emails
const AUTHORIZED_TRAINER_EMAILS = [
  'sjayanth.ip@gmail.com', // Add your authorized trainer emails here
  // Add more trainer emails as needed
];

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, name, role) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, { displayName: name });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return { ...user, role: userData.role };
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google sign-in successful:', user);

      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.log('Creating new user document');
        // Determine role based on email
        const role = AUTHORIZED_TRAINER_EMAILS.includes(user.email) ? 'trainer' : 'student';
        
        // Create new user document
        const userData = {
          name: user.displayName,
          email: user.email,
          role: role,
          createdAt: serverTimestamp(),
          photoURL: user.photoURL,
          lastLogin: serverTimestamp()
        };
        
        await setDoc(userRef, userData);
        console.log('New user document created:', userData);
        return { ...user, role };
      }

      // Update last login timestamp
      await setDoc(userRef, {
        lastLogin: serverTimestamp()
      }, { merge: true });

      const userData = userDoc.data();
      console.log('Existing user data:', userData);
      
      // If user is in authorized trainer list but not marked as trainer, update their role
      if (AUTHORIZED_TRAINER_EMAILS.includes(user.email) && userData.role !== 'trainer') {
        await setDoc(userRef, { role: 'trainer' }, { merge: true });
        return { ...user, role: 'trainer' };
      }

      return { ...user, role: userData.role };
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          console.log('Auth state changed, user:', user);
          // Get user role from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User data from Firestore:', userData);
            
            // Check if user should be a trainer
            if (AUTHORIZED_TRAINER_EMAILS.includes(user.email) && userData.role !== 'trainer') {
              await setDoc(doc(db, 'users', user.uid), { role: 'trainer' }, { merge: true });
              setCurrentUser({ ...user, role: 'trainer' });
            } else {
              setCurrentUser({ ...user, role: userData.role });
            }
          } else {
            console.log('No user document found, creating one');
            // Determine role based on email
            const role = AUTHORIZED_TRAINER_EMAILS.includes(user.email) ? 'trainer' : 'student';
            
            // Create new user document
            await setDoc(doc(db, 'users', user.uid), {
              name: user.displayName,
              email: user.email,
              role: role,
              createdAt: serverTimestamp(),
              photoURL: user.photoURL,
              lastLogin: serverTimestamp()
            });
            setCurrentUser({ ...user, role });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setCurrentUser(user);
        }
      } else {
        console.log('No user logged in');
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 