import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  Alert,
  Dimensions,
} from 'react-native';
import { launchCamera, CameraOptions, ImagePickerResponse } from 'react-native-image-picker';

import { useAppState } from './hooks/useAppState';
import {
  openURL,
  recognizeTextFromImage,
  processRecognizedText,
  downloadPDF,
  checkCameraPermission,
} from './utils/utils';
import ReportList from './components/ReportList/ReportList';
import Support from './components/Support/Support';

import CameraIcon from './assets/scan';
import LogoBackground from './assets/logo';

import styles from './App.styles';


const App = () => {
  const {
    inputText,
    setInputText,
    displayText,
    setDisplayText,
    pdfFiles,
    setPdfFiles,
    savePdfFilesToStorage,
  } = useAppState();

  const isDarkMode = useColorScheme() === 'dark';
  const [showSupport, setShowSupport] = useState(false); // Состояние для отображения компонента поддержки

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#121212' : 'white',
  };

  const textColor = isDarkMode ? 'white' : 'black';

  const toggleSupport = () => {
    setShowSupport(!showSupport);
  };

  const getReport = async () => {
    const { error, success, filePath } = await downloadPDF(inputText, pdfFiles);

    if (error) {
      setDisplayText(error);
    } else if (success && filePath) {
      const updatedPdfFiles = [...pdfFiles, filePath];
      setPdfFiles(updatedPdfFiles);
      await savePdfFilesToStorage(updatedPdfFiles);
      setDisplayText(success);
    }
  };

  const handleButtonScanClick = async () => {
    setDisplayText('');

    if (await checkCameraPermission()) {
      launchCameraAction();
    } else {
      Alert.alert('Ошибка', `Не удалось получить доступ к 'камере'`);
    }
  };

  const launchCameraAction = () => {
    const options = { mediaType: 'photo' } as CameraOptions;

    launchCamera(options, async (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled camera picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error:', response.errorCode);
      } else {
        if (response.assets && response.assets.length > 0) {
          const imageUri = response.assets[0].uri || '';
          const recognizedText = await recognizeTextFromImage(imageUri);
          const vinCode = processRecognizedText(recognizedText);
          if (vinCode) {
            setInputText(vinCode);
          }
        } else {
          console.log('No image selected');
        }
      }
    });
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
            <Text style={[styles.smallText, { color: textColor }]}>
              Пожалуйста, предоставьте мне VIN-номер автомобиля после нажатия на кнопку "Отчет", и я постараюсь
              найти соответствующую информацию для вас.
            </Text>
          </View>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: textColor }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Введите VIN код"
            placeholderTextColor={isDarkMode ? 'lightgrey' : 'grey'}
            maxLength={32}
          />
          <Text style={[styles.smallText, { color: textColor }]}>или</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: isDarkMode ? '#2E2E2E' : 'lightgrey' }]}
            onPress={handleButtonScanClick}>
            <View style={styles.buttonContent}>
              <CameraIcon size='24' />
              <Text style={[styles.buttonText, { paddingLeft: 8, color: isDarkMode ? 'white' : 'black' }]}>
                Сканировать VIN код
              </Text>
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
              <Text style={[styles.buttonText, { color: isDarkMode ? 'black' : 'white' }]}>
                Описание и примеры работ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: isDarkMode ? 'white' : 'black' }]}
              onPress={toggleSupport}>
              <Text style={[styles.buttonText, { color: isDarkMode ? 'black' : 'white' }]}>Поддержка</Text>
            </TouchableOpacity>
          </View> 
          <Support visible={showSupport} onHide={toggleSupport} />
          {displayText.length > 0 && (
            <Text style={[styles.displayText, { color: textColor }]}>{displayText}</Text>
          )}
          <ReportList pdfFiles={pdfFiles} onDelete={(filePath) => {
            const updatedPdfFiles = pdfFiles.filter(file => file !== filePath);
            setPdfFiles(updatedPdfFiles);
            savePdfFilesToStorage(updatedPdfFiles);
          }}/>
          <View style={styles.logoContainer}>
            <LogoBackground width={Dimensions.get('window').width * 0.66} height={Dimensions.get('window').height * 0.66} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
