import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import config from './config';

export const fireBaseApp = initializeApp(config.firebaseConfig);
export const auth = getAuth(fireBaseApp);
export const db = getFirestore(fireBaseApp);

export default { auth, db, fireBaseApp };
