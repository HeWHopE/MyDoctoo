import type React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

interface CreatePDFProps {
  size?: 'A4' | 'A5' | 'A6';
  title: string;
  children: React.ReactNode;
  childStyles?: any;
}

export const CreatePDF = ({ size = 'A4', title, children, childStyles }: CreatePDFProps) => {
  const styles = StyleSheet.create({
    page: {
      display: 'flex',
      flexDirection: 'column',
      padding: 32,
    },
    title: {
      fontSize: 30,
      textAlign: 'center',
      marginBottom: 40,
    },
    logo: {
      fontSize: 12,
      textAlign: 'left',
    },
  });

  const mergedStyles = {
    ...styles,
    ...childStyles,
  };

  return (
    <Document>
      <Page size={size} style={mergedStyles.page}>
        <Text style={styles.logo}>DOCTOO</Text>
        <View style={mergedStyles.title} fixed>
          <Text>{title}</Text>
        </View>
        {children}
      </Page>
    </Document>
  );
};
