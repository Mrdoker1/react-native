import React from 'react';
import { View, StyleSheet } from 'react-native';
import Report from './Report';

interface ReportListProps {
  pdfFiles: string[];
  onDelete: (filePath: string) => void;
}

const ReportList: React.FC<ReportListProps> = ({ pdfFiles, onDelete }) => {
  // Обратим порядок элементов в массиве pdfFiles
  const reversedPdfFiles = [...pdfFiles].reverse();

  return (
    <View style={styles.container}>
      {reversedPdfFiles.map((filePath) => (
        <Report key={filePath} filePath={filePath} onDelete={onDelete} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginTop: 12,
  },
});

export default ReportList;
