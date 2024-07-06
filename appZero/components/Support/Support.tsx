import React from 'react';
import { View, Text, TouchableOpacity, Linking, Modal } from 'react-native';
import styles from './Support.styles';

interface SupportProps {
  visible: boolean;
  onHide: () => void;
}

const Support: React.FC<SupportProps> = ({ visible, onHide }) => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:rgvinbot@gmail.com');
  };

  const handleAlternativeLinkPress = () => {
    Linking.openURL('https://plati.market/itm/history-of-renault-dacia-cars-from-europe-by-vin-code/4144039');
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <TouchableOpacity onPress={onHide} style={styles.header}>
          <Text style={styles.title}>Поддержка</Text>
          <Text style={styles.hideText}>Скрыть</Text>
        </TouchableOpacity>
        <Text style={styles.text}>
          Если возникают проблемы с оплатой, можно воспользоваться альтернативным вариантом:{'\n'}
          <TouchableOpacity onPress={handleAlternativeLinkPress}>
            <Text style={styles.link}>Перейти</Text>
          </TouchableOpacity>
        </Text>
        <Text style={styles.text}>
          Если у вас возникли проблемы с работой приложения, хотели бы предложить дополнительный функционал или имеете предложения о сотрудничестве, пожалуйста, обращайтесь по электронной почте:{'\n'}
          <TouchableOpacity onPress={handleEmailPress}>
            <Text style={styles.link}>rgvinbot@gmail.com</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </Modal>
  );
};

export default Support;
