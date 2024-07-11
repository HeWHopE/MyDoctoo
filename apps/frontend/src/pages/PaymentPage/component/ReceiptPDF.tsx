import { CreatePDF } from '@/components/UI/CreatePDF/CreatePDF';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

interface ReceiptPDFProps {
  id: string;
  date: number;
  doctorName: string;
  appointmentDuration: number;
  pricePerHour: number;
}

export const ReceiptPDF = ({ id, date, doctorName, appointmentDuration, pricePerHour }: ReceiptPDFProps) => {
  const styles = StyleSheet.create({
    checkDetails: {
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

  const paymentDetails = [
    { fieldName: 'Payment ID', value: id },
    { fieldName: 'Date', value: formattedDate },
    { fieldName: 'Appointment with', value: doctorName },
    { fieldName: 'Appointment duration', value: `${appointmentDuration} hour` },
    { fieldName: 'Price per hour', value: `$${pricePerHour}` },
  ];

  return (
    <CreatePDF title='Payment Receipt' childStyles={styles}>
      {paymentDetails.map((detail, index) => (
        <View key={index} style={styles.checkDetails}>
          <Text style={styles.fieldName}>{detail.fieldName}</Text>
          <Text style={styles.fieldValue}>{detail.value}</Text>
        </View>
      ))}
      <View style={styles.divider} />
      <View style={styles.checkDetails}>
        <Text style={styles.fieldNameTotal}>Total</Text>
        <Text style={styles.total}>${appointmentDuration * pricePerHour}</Text>
      </View>
    </CreatePDF>
  );
};
