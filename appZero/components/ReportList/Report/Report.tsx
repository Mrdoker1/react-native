import React from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import { useColorScheme } from 'react-native';
import styles from './Report.styles';

interface ReportProps {
  filePath: string;
  onDelete: (filePath: string) => void; // Принимаем функцию onDelete как пропс
}

const Report: React.FC<ReportProps> = ({ filePath, onDelete }) => {

  const isDarkMode = useColorScheme() === 'dark';
  const fileName = filePath.split('/').pop();

  const share = async () => {
    try {
      const shareOptions = {
        url: `file://${filePath}`,
        type: 'application/pdf',
        showAppsToView: true,
      };

      await Share.open(shareOptions);
    } catch (error) {
    //   console.error('Error opening PDF:', error);
      // Можно показать пользователю сообщение об ошибке
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Удаление отчета',
      `Вы уверены, что хотите удалить файл ${fileName}?`,
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          onPress: async () => {
            try {
              await RNFS.unlink(filePath);
              onDelete(filePath); // Вызываем onDelete после успешного удаления
              console.log(`File deleted: ${filePath}`);
            } catch (error) {
              console.error(`Error deleting file ${filePath}:`, error);
              // Можно показать пользователю сообщение об ошибке
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <TouchableOpacity
          onPress={share}
          accessible={true}
          accessibilityLabel={`Открыть PDF: ${fileName}`}
          style={styles.touchableOpacity}
        >
          <Text style={[styles.text, { color: isDarkMode ? 'white' : 'black' }]}>{fileName}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Удалить</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.separator, { borderBottomColor: isDarkMode ? 'white' : 'black' }]} />
    </View>
  );
};

export default Report;
