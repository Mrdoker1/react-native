import { NativeModules } from 'react-native';

const { TextDetectionModule } = NativeModules;

const recognizeImage = (url) => {
  return TextDetectionModule.recognizeImage(url);
};

export default recognizeImage;