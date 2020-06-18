import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, AsyncStorage, Button, StatusBar, Image, TouchableOpacity, ScrollView, Dimensions, Alert, ActivityIndicator } from 'react-native';

import { getImages } from '../../services/httpRequests';

import styles from './styles';
import { useNavigation } from '@react-navigation/native';

const Photos: React.FC = ({ route }) => {
  const { placeName } = route.params;
  const [photosData, setPhotosData] = useState<object[]>([]);
  const [photosDataSelected, setPhotosDataSelected] = useState(0);
  const [imageHeight, setImageHeight] = useState(400);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    AsyncStorage.getItem(placeName).then(item => {
      if (item === null) {
        getImages(placeName).then(data => {
          if (data === 'Error') {
            Alert.alert('Algum erro ocorreu ao tentar buscar dados.', 'Reveja sua conexão com a rede');
            return;
          }
          setPhotosData(data as object[]);
          AsyncStorage.setItem(placeName, JSON.stringify(data));
        })
        return;
      }
      setPhotosData(JSON.parse(item));
    });
  }, []);

  const deviceWidth = useMemo(() => {
    return Math.round(Dimensions.get('window').width);
  }, []);

  useEffect(() => {
    if (photosData.length !== 0) {
      setImageHeight(Math.round(photosData[photosDataSelected].height / (photosData[photosDataSelected].width / deviceWidth)));
    } 
  }, [photosData, photosDataSelected]);

  

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent"/>
      <ScrollView style={styles.container}>
        
        <View style={styles.topContainer}>
          <View style={styles.topContainerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={require('../../assets/arrowLeftIcon.png')} style={styles.arrowIcon}/>
            </TouchableOpacity>
          </View>
          <View style={styles.topContainerCenter}>
            <Text style={styles.title}>
              {placeName}
            </Text>
          </View>
          <View style={styles.topContainerRight}>
            {/* <TouchableOpacity>
              <Image source={require('../../assets/reloadWhite.png')} style={styles.reloadIcon}/>
            </TouchableOpacity> */}
          </View>
        </View>

        {photosData.length !== 0 &&
          <>
            <View style={{borderRadius: 8}}>
              <View style={[styles.loadingView, {height: imageHeight}]}>
                <ActivityIndicator size="large" color="#eaeaea"/>
              </View>
              <Image
                source={{uri: photosData[photosDataSelected].urls.regular}}
                style={[styles.imageItem, {height: imageHeight}]}
                resizeMode="center"
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
              />
            </View>
            <Text style={styles.altDescriptionText}>{photosData[photosDataSelected].alt_description}</Text>
            <View style={styles.photographerTitleContainer}>
              <Image style={styles.photographerImage} source={{uri: photosData[photosDataSelected].user.profile_image.medium}} />
              <Text style={styles.photographerName}>{photosData[photosDataSelected].user.name}</Text>
            </View>
            <Text style={styles.photographerBio}>{photosData[photosDataSelected].user.bio}</Text>
            <View style={{height: 100}}/>
          </>
        }

      </ScrollView>

      <View style={styles.navigationButtonsContainer}>
            <View style={styles.navigationButtonsSectionLeft}>
              {photosDataSelected !== 0 &&
                <TouchableOpacity onPress={() => setPhotosDataSelected(photosDataSelected - 1)}>
                  <Image source={require('../../assets/semiArrowLeftIcon.png')} style={styles.semiArrowIcon}/>
                </TouchableOpacity>
              }
            </View>
            <View style={styles.navigationButtonsSectionRight}>
              {photosDataSelected !== photosData.length - 1 &&
                <TouchableOpacity onPress={() => setPhotosDataSelected(photosDataSelected + 1)}>
                  <Image source={require('../../assets/semiArrowRightIcon.png')} style={styles.semiArrowIcon}/>
                </TouchableOpacity>
              }
            </View>
        </View>
    </>
  );
}

export default Photos;