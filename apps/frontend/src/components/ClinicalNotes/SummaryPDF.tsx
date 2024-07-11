import { CreatePDF } from '@/components/UI/CreatePDF/CreatePDF';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import type { IAppointment } from '../../dataTypes/Appointment';
import dayjs from 'dayjs';

interface SummaryPDFProps {
  appointment: IAppointment;
}

export const SummaryPDF = ({ appointment }: SummaryPDFProps) => {
  const styles = StyleSheet.create({
    appointmentDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      width: '100%',
    },
    summaryDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      width: '100%',
    },
    fieldName: {
      fontSize: 18,
    },
    fieldValue: {
      fontSize: 19,
      marginLeft: 'auto',
    },
    divider: {
      height: 1,
      width: '100%',
      backgroundColor: '#E5E7EB',
      marginTop: 20,
      marginBottom: 20,
    },
  });

  const complaints = appointment.notesSummary?.complaints
    .map(complaint => complaint.name)
    .join(', ')
    .toLowerCase();
  const problematicBodyParts = appointment.notesSummary?.problematicBodyParts
    .map(complaint => complaint.name)
    .join(', ')
    .toLocaleLowerCase();

  const appointmentDetails = [
    { fieldName: 'Doctor', value: appointment.doctor?.firstName + ' ' + appointment.doctor?.lastName },
    { fieldName: 'Patient', value: appointment.patient?.firstName + ' ' + appointment.patient?.lastName },
    { fieldName: 'Appointment date', value: dayjs(appointment.startedAt).format('YYYY.MM.DD, HH:mm').concat(' UTC') },
  ];

  const summaryDetails = [
    { fieldName: "Patient's complaints", value: complaints },
    { fieldName: 'Body parts that may have problems', value: problematicBodyParts },
  ];

  return (
    <CreatePDF title='Appointment summary' childStyles={styles}>
      {appointmentDetails.map((detail, index) => (
        <View key={index} style={styles.appointmentDetails}>
          <Text style={styles.fieldName}>{detail.fieldName}</Text>
          <Text style={styles.fieldValue}>{detail.value}</Text>
        </View>
      ))}
      <View style={styles.divider} />
      {summaryDetails.map((detail, index) => (
        <View key={index} style={styles.summaryDetails}>
          <Text style={styles.fieldName}>{detail.fieldName}</Text>
          <Text style={styles.fieldValue}>{detail.value}</Text>
        </View>
      ))}
    </CreatePDF>
  );
};
