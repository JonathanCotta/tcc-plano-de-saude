import { initializeApp } from 'firebase/app';
import config from './config';

const fireBaseApp = initializeApp(config.firebaseConfig);

export default fireBaseApp;
