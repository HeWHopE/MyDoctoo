import { useEffect } from 'react';
import FHIR from 'fhirclient';
import { Spinner } from '../../components/UI';

const LaunchPage = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/node_modules/fhirclient/build/fhir-client.js';
    script.async = true;
    script.onload = () => {
      if (FHIR) {
        console.log('FHIR client loaded, authorizing with FHIR');

        FHIR.oauth2.authorize({
          client_id: import.meta.env.VITE_FHIR_CLIENT_ID,
          scope:
            'PATIENT.READ PATIENT.SEARCH, OBSERVATION.SEARCH, OBSERVATION.READ ALLERGYINTOLERANCE.SEARCH, CONDITION.SEARCH',
          redirect_uri: 'https://doctoo.org/profile',
          iss: import.meta.env.VITE_FHIR_ISS_URL,
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className='flex h-[75vh]  items-center justify-center'>
      <Spinner size={200} color='#089BAB' />
    </div>
  );
};

export default LaunchPage;
