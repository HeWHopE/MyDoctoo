import { CreatePDF } from '@/components/UI/CreatePDF/CreatePDF';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

interface AppoinmentSummaryPDFProps {
  date: number;
  patientName: string;
  patientDateOfBirth: number;
  patientGender: string;
  doctorName: string;
  doctorSpecialization: string;
  appointmentDuration: number;
  appointmentTime: string;
  symptoms: string;
  notes: string;
}

export const AppoinmentSummaryPDF = ({
  date,
  patientName,
  patientDateOfBirth,
  patientGender,
  doctorName,
  doctorSpecialization,
  appointmentDuration,
  appointmentTime,
  symptoms,
  notes,
}: AppoinmentSummaryPDFProps) => {
  const styles = StyleSheet.create({
    appointmentDetailsTitle: {
      marginBottom: 10,
      color: 'gray',
    },
    patientTitle: {
      marginBottom: 10,
      color: 'gray',
    },
    doctorTitle: {
      marginBottom: 10,
      color: 'gray',
    },
    listsContainer: {
      marginLeft: 20,
    },
    listLine: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      gap: 2,
    },
    beforeElement: {
      position: 'absolute',
      top: '35%',
      left: -15,
      width: 6,
      height: 6,
      backgroundColor: 'black',
      borderRadius: '50%',
      zIndex: 0,
    },
    listContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      marginBottom: 50,
      width: '100%',
      marginRight: 10,
      paddingRight: 20,
    },
    fieldName: {
      fontSize: 18,
      fontWeight: 'ultrabold',
    },
    fieldValue: {
      fontSize: 19,
    },
    divider: {
      height: 1,
      width: '100%',
      backgroundColor: '#E5E7EB',
      marginTop: 20,
      marginBottom: 20,
    },
    fieldNameTotal: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    total: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'right',
      width: '100%',
    },
  });

  const formattedDate = new Date(date * 1000).toLocaleDateString();
  const formattedOfBirth = new Date(patientDateOfBirth * 1000).toLocaleDateString();

  const patientInformation = [
    { fieldName: 'Name', value: patientName },
    { fieldName: 'Date of Birth', value: formattedDate },
    { fieldName: 'Gender', value: patientGender },
  ];

  const doctorInformation = [
    { fieldName: 'Name', value: doctorName },
    { fieldName: 'Medical Specialization', value: doctorSpecialization },
  ];

  const formattedAppointmentDuration = `${appointmentDuration} minutes`;

  const appointmentDetails = [
    { fieldName: 'Date', value: formattedOfBirth },
    { fieldName: 'Time', value: appointmentTime },
    { fieldName: 'Duration', value: formattedAppointmentDuration },
    { fieldName: 'Symptoms', value: symptoms },
    { fieldName: 'Notes from the Doctor', value: notes },
  ];

  return (
    <CreatePDF title='Appointment Summary' childStyles={styles}>
      <View style={styles.listsContainer}>
        <View>
          <Text style={styles.patientTitle}>Patient Information</Text>
          <View style={styles.listContainer}>
            {patientInformation.map((detail, index) => (
              <View key={index} style={styles.listLine}>
                <Text style={styles.beforeElement}></Text>
                <Text style={styles.fieldName}>{detail.fieldName}:</Text>
                <Text style={styles.fieldValue}>{detail.value}</Text>
              </View>
            ))}
          </View>
        </View>
        <View>
          <Text style={styles.doctorTitle}>Doctor Information</Text>
          <View style={styles.listContainer}>
            {doctorInformation.map((detail, index) => (
              <View key={index} style={styles.listLine}>
                <Text style={styles.beforeElement}></Text>
                <Text style={styles.fieldName}>{detail.fieldName}:</Text>
                <Text style={styles.fieldValue}>{detail.value}</Text>
              </View>
            ))}
          </View>
        </View>
        <View>
          <Text style={styles.appointmentDetailsTitle}>Appointment Details</Text>
          <View style={styles.listContainer}>
            {appointmentDetails.map((detail, index) => (
              <View key={index} style={styles.listLine}>
                <Text style={styles.beforeElement}></Text>
                <Text style={styles.fieldName}>{detail.fieldName}:</Text>
                <Text style={styles.fieldValue}>{detail.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.divider} />
    </CreatePDF>
  );
};
