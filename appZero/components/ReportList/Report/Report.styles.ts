import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: '100%',
      },
      wrapper: {
      },
      touchableOpacity: {
        padding: 12,
        backgroundColor: 'transparent',
      },
      text: {
        fontSize: 16,
        color: 'white',
        paddingVertical: 4,
      },
      deleteButton: {
        backgroundColor: '#FF6347',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginBottom: 12,
      },
      deleteButtonText: {
        color: 'white',
        fontSize: 16,
      },
      separator: {
        borderBottomWidth: 1,
        opacity: 0.2,
      },
});

export default styles;
