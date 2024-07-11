const fetchApi = async (url: string, token: string, options = {}) => {
  const defaultHeaders = {
    Accept: 'application/json+fhir',
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, { headers: { ...defaultHeaders }, ...options });
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json(); // assuming the server always returns JSON format
};

// Fetch patient data
export const fetchPatientData = (serverUrl: string, patientId: string, token: string) => {
  const loincs = encodeURIComponent('http://loinc.org|2106-3');
  const url = `${serverUrl}/Patient?patient=${patientId}&limit=50&code=${loincs}`;
  return fetchApi(url, token);
};

// Fetch allergies
export const fetchAllergies = (serverUrl: string, patientId: string, token: string) => {
  const loincs = encodeURIComponent('http://loinc.org|8601-7');
  const url = `${serverUrl}/AllergyIntolerance?clinical-status=active&patient=${patientId}&limit=50&code=${loincs}`;
  return fetchApi(url, token);
};

// Fetch conditions
export const fetchConditions = (serverUrl: string, patientId: string, token: string) => {
  const url = `${serverUrl}/Condition?clinical-status=active,inactive,resolved&patient=${patientId}&category=problem-list-item`;
  return fetchApi(url, token);
};

// Fetch observations
export const fetchObservations = (serverUrl: string, patientId: string, token: string) => {
  const url = `${serverUrl}/Observation?patient=${patientId}&subject=${patientId}&category=vital-signs&code=29463-7&date=2021-01-01`;
  return fetchApi(url, token);
};
