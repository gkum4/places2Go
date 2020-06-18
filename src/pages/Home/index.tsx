import React, { useState, useEffect, useCallback } from 'react';
import {
  View, 
  Text, 
  StatusBar, 
  ImageBackground, 
  Image, 
  TouchableOpacity, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  Keyboard,
  ActivityIndicator,
  LayoutAnimation,
} from 'react-native';

import DraggableFlatList from 'react-native-draggable-flatlist'

import ActionButton from 'react-native-action-button';

import { useNavigation } from '@react-navigation/native';

import { useUser } from '../../hooks/user';

import UserDialog from '../../components/UserDialog';
import AddPlaceDialog from '../../components/AddPlaceDialog';

import styles from './styles';

import { getPlaces2Go, getRandomCity, setNewPlaceToGo } from '../../services/httpRequests';
import Place2GoItem from '../../components/Place2GoItem';

interface ITodoItem {
  id: string;
  name: string;
  done: boolean;
}

interface IPlace2Go {
  name: string;
  id: string;
  who: string;
  todos: ITodoItem[];
}

const Home: React.FC = () => {
  const navigation = useNavigation();

  const { logIn, userName } = useUser();
  const [userDialogVisible, setUserDialogVisible] = useState(true);
  const [addPlaceDialogVisible, setAddPlaceDialogVisible] = useState(false);
  const [places2Go, setPlaces2Go] = useState<IPlace2Go[]>([] as IPlace2Go[]);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function prepareAnimation() {
    LayoutAnimation.configureNext({
      duration: 100,
      create: { type: 'linear', property: 'opacity', delay: 100, duration: 200 },
      update: { type: 'linear', property: 'opacity', delay: 100, duration: 200 },
      delete: { type: 'linear', property: 'opacity', delay: 100, duration: 200 },
    });
  }

  useEffect(() => {
    getPlaces2Go().then(places => {
      if (places === 'Error') {
        Alert.alert('Algum erro ocorreu ao tentar buscar dados salvos.', 'Reveja sua conexão com a rede');
        return;
      } else {
        setPlaces2Go(places as IPlace2Go[]);
      }
    });

    Keyboard.addListener('keyboardDidShow', () => {
      prepareAnimation();
      setKeyboardOpen(true);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      prepareAnimation();
      setKeyboardOpen(false);
    });
  }, []);

  const updatePlaces = async (): Promise<void> => {
    setLoading(true);
    const places = await getPlaces2Go();
    if (places === 'Error') {
      Alert.alert('Algum erro ocorreu ao tentar buscar dados.', 'Reveja sua conexão com a rede');
      setLoading(false);
      return;
    } else {
      setPlaces2Go(places as IPlace2Go[]);
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent"/>
      <ImageBackground source={require('../../assets/planeWindow.jpg')} style={styles.imageBackground} >
          
        <View style={styles.overlay}>

          <View style={styles.container}>
            {loading
              ?
                <>
                  <View style={styles.topContainer}>
                    <View style={styles.topIconContainer}>
                      {userName === 'eli' && 
                          <TouchableOpacity onPress={() => setUserDialogVisible(true)}>
                            <Image source={require('../../assets/eli.png')} style={styles.userIcon}/>
                          </TouchableOpacity> 
                      }
                      {userName === 'kuma' && 
                          <TouchableOpacity onPress={() => setUserDialogVisible(true)}>
                            <Image source={require('../../assets/kuma.png')} style={styles.userIcon}/>
                          </TouchableOpacity>
                      }
                      
                    </View>
                    <View style={styles.topContainerDivision}>
                      <Image source={require('../../assets/planeIcon.png')} style={styles.planeIcon}/>
                    </View>
                    <View style={styles.reloadContainer}>
                      <TouchableOpacity onPress={() => updatePlaces()}>
                        <Image source={require('../../assets/reloadBlack.png')} style={styles.reloadIcon}/>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#000"/>
                  </View>
                </>
              :
                <DraggableFlatList 
                  showsVerticalScrollIndicator={false}
                  ListHeaderComponent={() => (
                    <View style={styles.topContainer}>
                      <View style={styles.topIconContainer}>
                        {userName === 'eli' && 
                            <TouchableOpacity onPress={() => setUserDialogVisible(true)}>
                              <Image source={require('../../assets/eli.png')} style={styles.userIcon}/>
                            </TouchableOpacity> 
                        }
                        {userName === 'kuma' && 
                            <TouchableOpacity onPress={() => setUserDialogVisible(true)}>
                              <Image source={require('../../assets/kuma.png')} style={styles.userIcon}/>
                            </TouchableOpacity>
                        }
                        
                      </View>
                      <View style={styles.topContainerDivision}>
                        <Image source={require('../../assets/planeIcon.png')} style={styles.planeIcon}/>
                      </View>
                      <View style={styles.reloadContainer}>
                        <TouchableOpacity onPress={() => updatePlaces()}>
                          <Image source={require('../../assets/reloadBlack.png')} style={styles.reloadIcon}/>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  data={places2Go}
                  renderItem={({item, isActive, drag}) => (
                    <Place2GoItem place={item} places2Go={places2Go} setPlaces2Go={setPlaces2Go} key={item.id} drag={drag}/>
                  )}
                  keyExtractor={(item, index) => `draggable-item-${item.id}`}
                  onDragEnd={({ data }) => {
                    setPlaces2Go(data);
                  }}
                  ListFooterComponent={() => (
                    <View style={{width: '100%', height: 100}}/>
                  )}
                />
            }

          </View>
          {!keyboardOpen && 
            <ActionButton buttonColor="#03A9F4" fixNativeFeedbackRadius={true} hideShadow={true} useNativeFeedback={false} >
              <ActionButton.Item buttonColor='#03A9F4' title="Novo lugar" hideLabelShadow={true} onPress={() => setAddPlaceDialogVisible(true)} useNativeFeedback={false}>
                <Text style={{fontSize: 20, color: '#eaeaea'}}>+</Text>
              </ActionButton.Item>
              <ActionButton.Item buttonColor='#03A9F4' title="Adicionar lugar aleatório" onPress={async () => {
                const randomCity = await getRandomCity();
                if (randomCity === 'Error') {
                  Alert.alert('Algum erro ocorreu ao tentar buscar dados.', 'Reveja sua conexão com a rede');
                  return;
                }
                await setNewPlaceToGo(randomCity, userName);
                await updatePlaces();
              }} hideLabelShadow={true} useNativeFeedback={false}>
                <Image source={require('../../assets/random.png')} style={{width: 18, height: 18}} />
              </ActionButton.Item>
            </ActionButton>
          }
          
          
          
          

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            enabled
          >
            <UserDialog setUserDialogVisible={setUserDialogVisible} userDialogVisible={userDialogVisible}/>
          </KeyboardAvoidingView>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            enabled
          >
            <AddPlaceDialog
              addPlaceDialogVisible={addPlaceDialogVisible}
              setAddPlaceDialogVisible={setAddPlaceDialogVisible}
              updatePlaces={updatePlaces}
            />
          </KeyboardAvoidingView>
          
          

        </View>
      </ImageBackground>
    </>
  );
};

export default Home;
