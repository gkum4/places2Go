import { StyleSheet, Platform, Dimensions } from 'react-native';

const deviceWidth = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    paddingHorizontal: 15,
    backgroundColor: '#151515',
  },
  topContainer: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 25 + (Platform.OS === 'android' ? 15 : 0),
    paddingVertical: 15,
  },
  topContainerLeft: {
    flex: 1,
    alignItems: 'center',
    flexDirection: "row",
  },
  topContainerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainerRight: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row-reverse',
  },
  arrowIcon: {
    width: 30,
    height: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#eaeaea',
  },
  reloadIcon: {
    width: 30,
    height: 30,
  },
  imageItem: {
    borderRadius: 8,
    width: deviceWidth - 30,
    position: 'absolute'
  },
  navigationButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#000',
  },
  navigationButtonsSectionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigationButtonsSectionRight: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  semiArrowIcon: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
  },
  altDescriptionText: {
    fontSize: 18,
    color: '#eaeaea',
    textAlign: 'center',
    marginBottom: 10,
  },
  photographerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  photographerTitleContainer: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    width: '100%',
  },
  photographerName: {
    color: '#eaeaea',
    fontSize: 14,
    fontWeight: 'bold',
  },
  photographerBio: {
    fontStyle: 'italic',
    fontSize: 12,
    color: '#eaeaea',
  },
  loadingView: {
    borderRadius: 8,
    width: deviceWidth - 30,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default styles;
