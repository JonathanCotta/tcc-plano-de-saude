import { getFirestore } from 'firebase/firestore';
import fireBaseApp from 'fireBaseApp';

export const db = getFirestore(fireBaseApp);

export default db;
