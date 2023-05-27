import { getFirestore } from 'firebase/firestore';
import fireBaseApp from 'fireBaseApp';

const db = getFirestore(fireBaseApp);

export default db;
