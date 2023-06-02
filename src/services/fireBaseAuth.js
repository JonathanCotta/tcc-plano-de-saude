import { getAuth } from 'firebase/auth';

import fireBaseApp from '../fireBaseApp';

export const auth = getAuth(fireBaseApp);

export default auth;
