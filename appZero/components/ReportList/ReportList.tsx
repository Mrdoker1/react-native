import React from 'react';
import { View } from 'react-native';
import Report from './Report/Report';
import styles from './ReportList.styles';

interface ReportListProps {
  pdfFiles: string[];
  onDelete: (filePath: string) => void;
}

const ReportList: React.FC<ReportListProps> = ({ pdfFiles, onDelete }) => {
  // Новые отчеты будут отображены первыми
  const reversedPdfFiles = [...pdfFiles].reverse();

  return (
    <View style={styles.container}>
      {reversedPdfFiles.map((filePath) => (
        <Report key={filePath} filePath={filePath} onDelete={onDelete} />
      ))}
    </View>
  );
};

export default ReportList;
