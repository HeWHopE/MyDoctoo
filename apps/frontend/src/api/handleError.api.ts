import type { AxiosError } from 'axios';
import axios from 'axios';

export default function handleError(error: Error | AxiosError) {
  if (axios.isAxiosError(error)) {
    console.error(error.response?.data);
    console.error(error.response?.status);
    console.error(error.response?.headers);
  } else {
    console.error(error.message);
  }
  throw error;
}

// USAGE:
/*

import handleError from './api/handleError.api';

try {

 **some code that might throw an error**

} catch (error) {

 handleError(error);
 
}

*/
