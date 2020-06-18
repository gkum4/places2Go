import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, Platform } from 'react-native';

import { Dialog } from 'react-native-simple-dialogs';

import { useUser } from '../hooks/user';

interface UserDialogDTO {
  userDialogVisible: boolean;
  setUserDialogVisible(value: boolean): void;
}

const UserDialog: React.FC<UserDialogDTO> = ({ userDialogVisible, setUserDialogVisible }) => {
  const { logIn } = useUser();

  const actualDate = new Date();

  return (
  <Dialog
    visible={userDialogVisible}
    dialogStyle={{borderRadius: 15, backgroundColor: '#00000099', overflow: 'hidden'}}
  >
    <View style={styles.dialogContainer}>
      <Text style={styles.dialogUserTitle}>Quem é você?</Text>
      <View style={styles.dialogUserImagesContainer}>
        <TouchableOpacity style={styles.dialogUserImageContainer} onPress={() => {
          logIn('eli');
          setUserDialogVisible(false);
        }}>
            <Image source={require('../assets/eli.png')} style={styles.dialogUserImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.dialogUserImageContainer} onPress={() => {
          logIn('kuma');
          setUserDialogVisible(false);
        }}>
            <Image source={require('../assets/kuma.png')} style={styles.dialogUserImage} />
        </TouchableOpacity>
      </View>
      {(actualDate.getMonth() === 5 && actualDate.getDate() === 12) && 
        <Text style={{fontSize: 18, color: '#eaeaea', textAlign: 'center', marginTop: 15,}}>Feliz dia dos namorados ❤️ ❤️ ❤️</Text>
      }
      
    </View>
  </Dialog>
  );
}

export default UserDialog;

const styles = StyleSheet.create({
  dialogContainer: {
    paddingVertical: 10,
  },
  dialogUserTitle: {
    fontSize: 25,
    color: '#eaeaea',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dialogUserImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  dialogUserImageContainer: {
    marginHorizontal: 15,
  },
  dialogUserImage: {
    height: 100,
    width: 100,
  },
});
