import { Linking, Alert } from 'react-native';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const STORAGE_KEY = 'pdfFiles';

export const openURL = (url: string) => {
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        Alert.alert('Ошибка', 'Невозможно обработать предоставленный URL');
      }
    })
    .catch((err) => Alert.alert('Ошибка', 'Произошла ошибка при открытии URL'));
};

export const recognizeTextFromImage = async (imageURL: string) => {
  if (imageURL) {
    try {
      const result = await TextRecognition.recognize(imageURL);
      console.log('Recognized text:', result.text);
      return result.text;
    } catch (error) {
      console.error('Text recognition error:', error);
    }
  } else {
    Alert.alert('Ошибка', `Невозможно обработать предоставленный URL ${imageURL}`);
  }
  return '';
};

export const processRecognizedText = (text: string) => {
  const regex = /(XT|VF|UU|X7|KN|WF)\w{15}/g;
  const trimmedText = text.trim().toUpperCase().replace(/[\n\r]/g, '');

  const vinMatches = trimmedText.match(regex);

  if (vinMatches && vinMatches.length > 0) {
    return vinMatches[0];
  } else {
    Alert.alert('Ошибка', 'Не смогли распознать или неверный формат VIN-кода!');
  }
  return '';
};

export const loadPdfFiles = async () => {
  try {
    const storedPdfFiles = await AsyncStorage.getItem(STORAGE_KEY);
    if (storedPdfFiles) {
      return JSON.parse(storedPdfFiles);
    }
  } catch (error) {
    console.error('Error loading PDF files from storage:', error);
  }
  return [];
};

export const savePdfFiles = async (files: string[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  } catch (error) {
    console.error('Error saving PDF files to storage:', error);
  }
};

export const downloadPDF = async (inputText: string, pdfFiles: string[]) => {
  if (!inputText) {
    return { error: 'Введите VIN-код перед запросом.' };
  }

  if (inputText.length !== 17) {
    return { error: 'Введите корректный VIN-код перед запросом.' };
  }

  if (pdfFiles.some(filePath => filePath.includes(inputText))) {
    return { error: 'Файл с этим VIN-кодом уже был загружен.' };
  }

  try {
    const pdfUrl = `https://pdfobject.com/pdf/sample.pdf`; // Тут будет эндпоинт
    const localFilePath = `${RNFS.DocumentDirectoryPath}/${inputText}.pdf`;

    const downloadResponse = await RNFS.downloadFile({
      fromUrl: pdfUrl,
      toFile: localFilePath,
    }).promise;

    if (downloadResponse.statusCode === 200) {
      return { success: 'PDF файл успешно загружен!', filePath: localFilePath };
    } else {
      return { error: 'Ошибка при загрузке PDF файла.' };
    }
  } catch (error) {
    console.error('Error downloading PDF:', error);
    return { error: 'Произошла ошибка при загрузке PDF файла.' };
  }
};

export const checkCameraPermission = async () => {
  const checkPermission = await check(PERMISSIONS.ANDROID.CAMERA);

  if (checkPermission === RESULTS.GRANTED) {
    return true;
  } else {
    const requestPermission = await request(PERMISSIONS.ANDROID.CAMERA);
    return requestPermission === RESULTS.GRANTED;
  }
};
