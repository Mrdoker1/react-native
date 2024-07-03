import React, { useState } from 'react';
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
  Alert
} from 'react-native';
import { CameraScreen, CameraType } from 'react-native-camera-kit';


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


  const handleButtonClick = () => {
    setDisplayText(`Working in progress...`);
  };

  const handleButtonScanClick = () => {
    setIsCameraOpen(true);
  };

  // const handleScanSuccess = () => {
  //   setIsCameraOpen(false);
  // };

  const handleScanSuccess = (nativeEvent: GestureResponderEvent) => {
    setIsCameraOpen(false);
  };

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#121212' : 'white',
  };

  const textColor = isDarkMode ? 'white' : 'black';

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
            style={[styles.input, { borderColor: textColor }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Введите VIN код"
            placeholderTextColor={textColor}
          />
          <Text style={[styles.smallText, { color: textColor }]}>или</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: isDarkMode ? 'black' : 'lightgrey' }]}
            onPress={handleButtonScanClick}>
            <View style={styles.buttonContent}>
              <CameraIcon size='24' isDarkMode />
              <Text style={[styles.buttonText, { paddingLeft: 8, color: isDarkMode ? 'white' : 'black' }]}>Сканировать VIN код</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: isDarkMode ? 'white' : 'black' }]}
              onPress={handleButtonClick}>
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
          <Text style={[styles.displayText, { color: textColor }]}>{displayText}</Text>
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
});

export default App;
