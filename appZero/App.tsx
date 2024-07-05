import React, { useEffect, useRef, useState } from 'react';
import CameraIcon from './assets/scan';
import {
  GestureResponderEvent,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  Linking,
  Alert,
  Dimensions
} from 'react-native';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import RNFS from 'react-native-fs';
import { CameraOptions, ImagePickerResponse } from 'react-native-image-picker';
import {launchCamera} from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import ReportList from './ReportList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoBackground from './assets/logo'; // Импортируйте компонент логотипа

const openURL = (url: string) => {
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

const App = () => {
  const [inputText, setInputText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState('');
  const [recognizedText, setRecognizedText] = useState('');
  const [pdfFiles, setPdfFiles] = useState<string[]>([]);

  useEffect(() => {
    loadPdfFiles();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayText('');
    }, 5000); // Через 5000 миллисекунд (5 секунд) текст обнулится

    return () => clearTimeout(timer); // Очистка таймера при размонтировании компонента или изменении состояния
  }, [displayText]);

  const STORAGE_KEY = 'pdfFiles';

  const loadPdfFiles = async () => {
    try {
      const storedPdfFiles = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedPdfFiles) {
        setPdfFiles(JSON.parse(storedPdfFiles));
      }
    } catch (error) {
      console.error('Error loading PDF files from storage:', error);
    }
  };

  const savePdfFiles = async (files: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    } catch (error) {
      console.error('Error saving PDF files to storage:', error);
    }
  };

  const handlePDFDelete = (filePath: string) => {
    const updatedPdfFiles = pdfFiles.filter(file => file !== filePath);
    setPdfFiles(updatedPdfFiles);
    savePdfFiles(updatedPdfFiles); // Сохраняем обновленный список PDF-файлов
  };

  // Функция распознавания текста из URL-адреса изображения
  async function recognizeTextFromImage(imageURL:string) {
    if (imageURL) {
      try {
        const result = await TextRecognition.recognize(imageURL);
        console.log('Recognized text:', result.text);
        processRecognizedText(result.text); // Обработка распознанного текста
        setRecognizedText(result.text);
      } catch (error) {
        console.error('Text recognition error:', error);
      }
    } else {
      Alert.alert('Ошибка', `Невозможно обработать предоставленный URL ${imageURL}`, );
    }
  }

  const getReport = async () => {
    if (!inputText) {
      setDisplayText('Введите VIN-код перед запросом.');
      return;
    }

    if (inputText.length !== 17) {
      setDisplayText('Введите корректный VIN-код перед запросом.');
      return;
    }

    if (pdfFiles.some(filePath => filePath.includes(inputText))) {
      setDisplayText('Файл с этим VIN-кодом уже был загружен.');
      return;
    }

    try {
      const pdfUrl = `https://pdfobject.com/pdf/sample.pdf`; // Тут будет эндпоинт
      const localFilePath = `${RNFS.DocumentDirectoryPath}/${inputText}.pdf`;

      const downloadResponse = await RNFS.downloadFile({
        fromUrl: pdfUrl,
        toFile: localFilePath,
      }).promise;

      if (downloadResponse.statusCode === 200) {
        const updatedPdfFiles = [...pdfFiles, localFilePath];
        setPdfFiles(updatedPdfFiles);
        await savePdfFiles(updatedPdfFiles); // Сохраняем обновленный список PDF-файлов
        setDisplayText('PDF файл успешно загружен!');
      } else {
        setDisplayText('Ошибка при загрузке PDF файла.');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setDisplayText('Произошла ошибка при загрузке PDF файла.');
    }
  };

    // Функция для обработки распознанного текста
    const processRecognizedText = (text: string) => {
      const regex = /(XT|VF|UU|X7|KN|WF)\w{15}/g; // Регулярное выражение для поиска VIN-кода
      const trimmedText = text.trim().toUpperCase().replace(/[\n\r]/g, ''); // Приводим текст к верхнему регистру, удаляем лишние пробелы и удаляем переносы строк
      
      console.log(trimmedText);
    
      // Находим все вхождения VIN-кодов в тексте
      const vinMatches = trimmedText.match(regex);
    
      if (vinMatches && vinMatches.length > 0) {
        const firstVin = vinMatches[0]; // Берем первое найденное вхождение
        setInputText(firstVin); // Вставляем распознанный VIN-код в инпут
        // Дополнительная логика обработки распознанного VIN-кода здесь
      } else {
        setDisplayText('Не смогли распознать или неверный формат VIN-кода!');
      }
    };

    // Функция для открытия камеры и захвата изображения
    const handleButtonScanClick = async () => {
      setDisplayText('');
      const checkCameraPermission = await check(PERMISSIONS.ANDROID.CAMERA);

      try {    
        if (checkCameraPermission === RESULTS.GRANTED) {
          launchCameraAction();
        } else {
          const requestCameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
    
          if (requestCameraPermission === RESULTS.GRANTED) {
            launchCameraAction();
          } else {
            Alert.alert('Ошибка', `Не удалось получить доступ к 'камере'`);
          }
        }
      } catch (error) {
        console.error('Permission check/request error:', error);
        Alert.alert('Ошибка', `Произошла ошибка при проверке или запросе разрешений`);
      }
    };

    const launchCameraAction = () => {
      const options = {
        mediaType: 'photo',
      } as CameraOptions;
  
      launchCamera(options, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log('User cancelled camera picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error:', response.errorCode);
        } else {
          console.log('ImagePicker Response:', response);
  
          if (response.assets && response.assets.length > 0) {
            const imageUri = response.assets[0].uri || '';
            setCapturedImage(imageUri);
            recognizeTextFromImage(imageUri);
          } else {
            console.log('No image selected');
          }
        }
      });
    };

  const handleScanSuccess = (nativeEvent: GestureResponderEvent) => {
    setIsCameraOpen(false);
  };

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#121212' : 'white',
  };

  const textColor = isDarkMode ? 'white' : 'black';

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };
  
  return (

    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[styles.scrollView, backgroundStyle]}>
        <View style={styles.sectionContainer}>
          <View style={styles.container}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Добрый день!</Text>
            <Text style={[styles.smallText, { color: textColor }]}>Пожалуйста, предоставьте мне VIN-номер автомобиля после нажатия на кнопку "Отчет", и я постараюсь найти соответствующую информацию для вас.</Text>
          </View>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: textColor }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Введите VIN код"
            placeholderTextColor={isDarkMode ? 'lightgrey' : 'grey'}
            maxLength={32} // VIN-код обычно имеет длину 17 символов
          />
          <Text style={[styles.smallText, { color: textColor }]}>или</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: isDarkMode ? '#2E2E2E' : 'lightgrey' }]}
            onPress={handleButtonScanClick}>
            <View style={styles.buttonContent}>
              <CameraIcon size='24' />
              <Text style={[styles.buttonText, { paddingLeft: 8, color: isDarkMode ? 'white' : 'black' }]}>Сканировать VIN код</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: isDarkMode ? 'white' : 'black' }]}
              onPress={getReport}>
              <Text style={[styles.buttonText, { color: isDarkMode ? 'black' : 'white' }]}>Отчет</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: isDarkMode ? 'white' : 'black' }]}
              onPress={() => openURL('https://telegra.ph/Opisanie-i-primery-raboty-RVinBot-11-23')}>
              <Text style={[styles.buttonText, { color: isDarkMode ? 'black' : 'white' }]}>Описание и примеры работ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: isDarkMode ? 'white' : 'black' }]}
              onPress={() => openURL('mailto:fixrapdok@gmail.com')}>
              <Text style={[styles.buttonText, { color: isDarkMode ? 'black' : 'white' }]}>Поддержка</Text>
            </TouchableOpacity>
          </View>
          {displayText.length > 0 ? (<Text style={[styles.displayText, { color: textColor }]}>{displayText}</Text>) : <></>}
          <ReportList pdfFiles={pdfFiles} onDelete={handlePDFDelete}/>
          <View style={styles.logoContainer}>
            <LogoBackground width={Dimensions.get('window').width * 0.66} height={Dimensions.get('window').height * 0.66} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  scrollView: {
    flex: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  sectionContainer: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  input: {
    padding: 12,  // Добавлен отступ слева
    height: 44,
    width: '100%',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 5,
  },
  button: {
    width: '100%',
    height: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  displayText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '400',
  },
  smallText: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '400',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 16,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: 0.05, // Прозрачность логотипа
    zIndex: -1, // Чтобы логотип был на заднем плане
  },
});

export default App;
