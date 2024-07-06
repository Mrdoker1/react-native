import { StyleSheet, Dimensions } from 'react-native';

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

export default styles;
