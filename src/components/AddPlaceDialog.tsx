import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, Platform, TextInput, AsyncStorage } from 'react-native';

import { Dialog } from 'react-native-simple-dialogs';

import { useUser } from '../hooks/user';
import { setNewPlaceToGo } from '../services/httpRequests';

interface IPlace2Go {
  name: string;
  id: string;
  who: string;
}

interface AddPlaceDialogDTO {
  addPlaceDialogVisible: boolean;
  setAddPlaceDialogVisible(value: boolean): void;
  updatePlaces(): void;
}

const AddPlaceDialog: React.FC<AddPlaceDialogDTO> = ({ addPlaceDialogVisible, setAddPlaceDialogVisible, updatePlaces }) => {
  const [placeName, setPlaceName] = useState('');
  const { userName } = useUser();

  const handleBoraPress = async () => {
    if (placeName === 'clear asyncstorage') {
      await AsyncStorage.clear();
      return;
    }
    const newPlace2Go = await setNewPlaceToGo(placeName, userName);
    await updatePlaces();
    setPlaceName('');
    setAddPlaceDialogVisible(false);
  }

  return (
    <Dialog
      visible={addPlaceDialogVisible}
      dialogStyle={{borderRadius: 15, backgroundColor: '#00000099', overflow: 'hidden'}}
      onTouchOutside={() => {
        setPlaceName('');
        setAddPlaceDialogVisible(false);
      }}
    >
      <View style={styles.dialogContainer}>
        <View style={styles.dialogTopContainer}>
          {userName === 'eli' 
          ?
            <Image source={require('../assets/eli.png')} style={styles.userImage} /> 
          :
            <Image source={require('../assets/kuma.png')} style={styles.userImage} />
          }
          <Text style={styles.dialogTitle}>Para onde você quer ir?</Text>
        </View>
        <TextInput
          placeholder ={'ex.: New York'}
          autoCapitalize='words'
          style={styles.textInput}
          placeholderTextColor="#eaeaea40"
          value={placeName}
          onChangeText={text => setPlaceName(text)}
          onSubmitEditing={handleBoraPress}
        />
        <TouchableOpacity style={styles.boraButton} onPress={handleBoraPress}>
          <Text style={styles.boraButtonText}>Bora</Text>
        </TouchableOpacity>
      </View>
    </Dialog>
  );
}

export default AddPlaceDialog;

const styles = StyleSheet.create({
  dialogContainer: {
    paddingVertical: 10,
  },
  dialogTopContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  dialogTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#eaeaea',
  },
  userImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  textInput: {
    fontSize: 18,
    color: '#eaeaea',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    marginTop: 40,
  },
  boraButton: {
    backgroundColor: '#03A9F4',
    borderRadius: 8,
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
  boraButtonText: {
    color: '#eaeaea',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
