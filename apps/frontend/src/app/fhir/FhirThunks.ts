import { instance } from '../../api/axios.api';
import type { IFhir } from '../../dataTypes/Fhir';

export async function fetchPatientData(body: IFhir) {
  try {
    const response = await instance.post(`/fhir/patient/${body.patientId}`, {
      token: body.token,
      serverUrl: body.serverUrl,
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch patient data:', error);
    throw error;
  }
}

export async function fetchObservationData(body: IFhir) {
  try {
    const response = await instance.post(`/fhir/observation/${body.patientId}`, {
      token: body.token,
      serverUrl: body.serverUrl,
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch patient data:', error);
    throw error;
  }
}
