import { db } from "../config/firebase";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  increment,
  runTransaction,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  onSnapshot
} from "firebase/firestore";
import { auth } from "../config/firebase";
import store from "../redux/store";
import { setCredits, setError } from "../redux/creditSlice";

const INITIAL_CREDITS = 50;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Enable offline persistence with unlimited cache
try {
  enableIndexedDbPersistence(db, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  }).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });
} catch (e) {
  console.warn('Persistence initialization error:', e);
}

// Track active listeners to prevent duplicates
let activeListeners = new Map();

// Helper function to add delay between retries
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to retry operations
const retryOperation = async (operation, retries = MAX_RETRIES) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === retries - 1) throw error;
      if (error.code === 'permission-denied') throw error;
      
      console.warn(`Operation failed, retrying (${i + 1}/${retries})...`, error);
      await delay(RETRY_DELAY * (i + 1));
    }
  }
};

// Helper function to ensure auth is initialized
const ensureAuth = () => {
  return new Promise((resolve, reject) => {
    if (auth.currentUser) {
      resolve(auth.currentUser);
    } else {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        if (user) {
          resolve(user);
        } else {
          reject(new Error("User not authenticated"));
        }
      });
    }
  });
};

// Setup real-time listener for credits
const setupCreditsListener = (userId) => {
  if (!userId) return null;
  
  // Check if listener already exists
  if (activeListeners.has(userId)) {
    return activeListeners.get(userId);
  }

  const userRef = doc(db, "users", userId);
  
  const unsubscribe = onSnapshot(userRef, 
    (doc) => {
      if (doc.exists()) {
        const credits = doc.data().credits || 0;
        store.dispatch(setCredits(credits));
        store.dispatch(setError(null));
      }
    },
    (error) => {
      console.error("Credits listener error:", error);
      handleFirestoreError(error, userId);
    }
  );

  activeListeners.set(userId, unsubscribe);
  return unsubscribe;
};

// Cleanup listener
export const cleanupCreditsListener = (userId) => {
  const unsubscribe = activeListeners.get(userId);
  if (unsubscribe) {
    unsubscribe();
    activeListeners.delete(userId);
  }
};

// Initialize user credits
export const initializeUserCredits = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    await ensureAuth();
    const userRef = doc(db, "users", userId);
    
    const result = await retryOperation(async () => {
      const existingDoc = await getDoc(userRef);
      
      if (existingDoc.exists()) {
        const credits = existingDoc.data().credits;
        return credits || 0;
      }

      const userData = {
        credits: INITIAL_CREDITS,
        lastRefillDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(userRef, userData);
      return INITIAL_CREDITS;
    });

    // Setup listener after initialization
    setupCreditsListener(userId);
    
    return result;
  } catch (error) {
    console.error("Error initializing credits:", error);
    handleFirestoreError(error, userId);
    throw error;
  }
};

// Get user credits
export const getUserCredits = async (userId) => {
  if (!userId) {
    console.warn("getUserCredits called without userId");
    return 0;
  }

  try {
    await ensureAuth();
    const userRef = doc(db, "users", userId);
    
    const credits = await retryOperation(async () => {
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return await initializeUserCredits(userId);
      }

      return userDoc.data().credits || 0;
    });

    // Setup listener if not already set
    setupCreditsListener(userId);
    
    return credits;
  } catch (error) {
    console.error("Error getting credits:", error);
    handleFirestoreError(error, userId);
    throw error;
  }
};

// Deduct credit with explicit steps
export const deductCredit = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    await ensureAuth();
    const userRef = doc(db, "users", userId);

    // Step 1: Get current credits
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error("User document does not exist!");
    }

    const currentCredits = userDoc.data().credits;
    if (typeof currentCredits !== 'number') {
      throw new Error("Invalid credit value in database");
    }

    console.log("Current credits before deduction:", currentCredits);
    
    if (currentCredits <= 0) {
      throw new Error("Insufficient credits!");
    }

    // Step 2: Calculate new credit amount
    const newCreditAmount = currentCredits - 1;

    // Step 3: Update Firestore with new amount
    try {
      await updateDoc(userRef, {
        credits: newCreditAmount,
        updatedAt: new Date().toISOString(),
        lastDeductionTime: new Date().toISOString()
      });

      // Step 4: Verify the update
      const verificationDoc = await getDoc(userRef);
      const verifiedCredits = verificationDoc.data().credits;

      console.log("Verification - New credits:", verifiedCredits);
      
      if (verifiedCredits !== newCreditAmount) {
        console.error("Credit deduction verification failed", {
          expected: newCreditAmount,
          actual: verifiedCredits
        });
        // Force sync with Firestore
        store.dispatch(setCredits(verifiedCredits));
        throw new Error("Credit deduction failed verification");
      }

      // Update Redux store
      store.dispatch(setCredits(newCreditAmount));
      return newCreditAmount;
    } catch (updateError) {
      console.error("Error updating credits:", updateError);
      // Recheck current credits after failed update
      const recheckDoc = await getDoc(userRef);
      const currentCreditsAfterError = recheckDoc.data().credits;
      store.dispatch(setCredits(currentCreditsAfterError));
      throw updateError;
    }
  } catch (error) {
    console.error("Error in deductCredit:", error);
    handleFirestoreError(error, userId);
    throw error;
  }
};

// Add credits (for future purchase implementation)
export const addCredits = async (userId, amount) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    await ensureAuth();
    const userRef = doc(db, "users", userId);
    
    return await retryOperation(async () => {
      await updateDoc(userRef, {
        credits: increment(amount),
        updatedAt: new Date().toISOString(),
        lastPurchaseTime: new Date().toISOString() // Track purchases
      });
      
      const updatedDoc = await getDoc(userRef);
      return updatedDoc.data().credits || 0;
    });
  } catch (error) {
    console.error("Error adding credits:", error);
    handleFirestoreError(error, userId);
    throw error;
  }
};

// Helper function to handle Firestore errors
const handleFirestoreError = (error, userId) => {
  const errorMessage = (() => {
    if (error.code === 'permission-denied') {
      return 'Authentication error. Please sign in again.';
    } else if (error.code === 'unavailable') {
      return 'Service temporarily unavailable. Please try again later.';
    } else if (error.code === 'failed-precondition') {
      return 'Operation failed. Please refresh the page.';
    }
    return error.message;
  })();

  store.dispatch(setError(errorMessage));
  
  console.error(`
    Firestore Error:
    - Code: ${error.code}
    - Message: ${error.message}
    - User ID: ${userId}
    - Auth State: ${auth.currentUser ? 'Authenticated' : 'Not authenticated'}
    - Auth UID: ${auth.currentUser?.uid}
  `);
}; 