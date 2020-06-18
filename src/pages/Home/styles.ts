import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    backgroundColor: '#c6c6c680',
    flex: 1,
  },
  container: {
    flex: 1,
    minHeight: '100%',
    paddingHorizontal: 15,
  },
  topContainer: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 25 + (Platform.OS === 'android' ? 15 : 0),
    height: 50,
    marginBottom: 10,
  },
  topContainerDivision: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topIconContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  userIcon: {
    width: 40,
    height: 40,
  },
  planeIcon: {
    width: 35,
    height: 35,
  },
  placeItemContainer: {
    width: '100%',
    height: 60,
    backgroundColor: '#00000080',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 15,
    flexDirection: 'row',
    marginBottom: 15,
  },
  placeItemText: {
    fontSize: 18,
    color: '#eaeaea',
    fontWeight: 'bold',
  },
  caretRightIcon: {
    width: 12,
    height: 20,
    marginRight: 10,
  },
  placeItemUserImage: {
    width: 25,
    height: 25,
    alignSelf: 'center',
  },
  reloadContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  reloadIcon: {
    width: 25,
    height: 25,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default styles;
