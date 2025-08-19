import React, {useState} from 'react';
import CameraIcon from './assets/scan';
import {
  NativeModules,
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
} from 'react-native';
import {CameraScreen} from 'react-native-camera-kit';

const {TextRecognitionModule} = NativeModules;

const openURL = (url: string) => {
  Linking.canOpenURL(url)
    .then(supported => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        Alert.alert('Ошибка', 'Невозможно обработать предоставленный URL');
      }
    })
    .catch(() => Alert.alert('Ошибка', 'Произошла ошибка при открытии URL'));
};

const App = () => {
  const [inputText, setInputText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [_recognizedText, setRecognizedText] = useState('');

  const recognizeText = async (imageUri: string) => {
    try {
      const result = await TextRecognitionModule.recognizeImage(imageUri);
      console.log('Text recognition result:', result);
      setRecognizedText(
        result.blocks.map((block: {text: any}) => block.text).join('\n'),
      );
    } catch (error) {
      console.error('Error recognizing text:', error);
      setRecognizedText('Ошибка распознавания текста');
    }
  };

  const onCapture = (event: any) => {
    setCapturedImage(event.nativeEvent.imageUri);
    Alert.alert('Ошибка', event.nativeEvent.imageUri);
    if (capturedImage != null) {
      recognizeText(event.nativeEvent.imageUri);
      setIsCameraOpen(false);
    }
  };

  const handleButtonClick = () => {
    setDisplayText('Working in progress...');
  };

  const handleButtonScanClick = () => {
    setIsCameraOpen(true);
  };

  // const handleScanSuccess = () => {
  //   setIsCameraOpen(false);
  // };

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#121212' : 'white',
  };

  const textColor = isDarkMode ? 'white' : 'black';

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  // Стили для динамических цветов
  const scanButtonStyle = {
    backgroundColor: isDarkMode ? 'black' : 'lightgrey',
  };

  const scanButtonTextStyle = {
    paddingLeft: 8,
    color: isDarkMode ? 'white' : 'black',
  };

  const mainButtonStyle = {
    backgroundColor: isDarkMode ? 'white' : 'black',
  };

  const mainButtonTextStyle = {
    color: isDarkMode ? 'black' : 'white',
  };

  const hiddenImageStyle = {
    width: 0,
    height: 0,
    opacity: 0,
  };

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {isCameraOpen ? (
        <View style={styles.cameraContainer}>
          <View style={styles.camera}>
            <CameraScreen
              onBottomButtonPressed={onCapture}
              onReadCode={() => {}}
              captureButtonImage={require('./assets/capture.png')}
              captureButtonImageStyle={hiddenImageStyle}
              cameraFlipImage={require('./assets/capture.png')}
              cameraFlipImageStyle={hiddenImageStyle}
              torchOnImage={require('./assets/capture.png')}
              torchOffImage={require('./assets/capture.png')}
              torchImageStyle={hiddenImageStyle}
              hideControls={true}
              showCapturedImageCount={false}
              cameraRatioOverlay={{}}
              showFrame={false}
              scanBarcode={false}
              laserColor="red"
              frameColor="white"
            />
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseCamera}>
            <Text style={styles.closeButtonText}>Закрыть камеру</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <SafeAreaView style={[styles.container, backgroundStyle]}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={[styles.scrollView, backgroundStyle]}>
            <View style={styles.sectionContainer}>
              <View style={styles.container}>
                <Text style={[styles.sectionTitle, {color: textColor}]}>
                  Добрый день!
                </Text>
                <Text style={[styles.smallText, {color: textColor}]}>
                  Пожалуйста, предоставьте мне VIN-номер автомобиля после
                  нажатия на кнопку "Отчет", и я постараюсь найти
                  соответствующую информацию для вас.
                </Text>
              </View>
              <TextInput
                style={[styles.input, {borderColor: textColor}]}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Введите VIN код"
                placeholderTextColor={textColor}
              />
              <Text style={[styles.smallText, {color: textColor}]}>или</Text>
              <TouchableOpacity
                style={[styles.button, scanButtonStyle]}
                onPress={handleButtonScanClick}>
                <View style={styles.buttonContent}>
                  <CameraIcon size="24" isDarkMode />
                  <Text style={[styles.buttonText, scanButtonTextStyle]}>
                    Сканировать VIN код
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, mainButtonStyle]}
                  onPress={handleButtonClick}>
                  <Text style={[styles.buttonText, mainButtonTextStyle]}>
                    Отчет
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, mainButtonStyle]}
                  onPress={() =>
                    openURL(
                      'https://telegra.ph/Opisanie-i-primery-raboty-RVinBot-11-23',
                    )
                  }>
                  <Text style={[styles.buttonText, mainButtonTextStyle]}>
                    Описание и примеры работ
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, mainButtonStyle]}
                  onPress={() => openURL('mailto:fixrapdok@gmail.com')}>
                  <Text style={[styles.buttonText, mainButtonTextStyle]}>
                    Поддержка
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.displayText, {color: textColor}]}>
                {displayText}
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
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
    padding: 12, // Добавлен отступ слева
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
});

export default App;
