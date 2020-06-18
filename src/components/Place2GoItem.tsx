import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { deletePlace } from '../services/httpRequests';

import TodoItem from './TodoItem';

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

interface IPlace2GoItem {
  place: IPlace2Go;
  places2Go: IPlace2Go[];
  setPlaces2Go(places: IPlace2Go[]): void;
  drag: () => void;
}

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Place2GoItem: React.FC<IPlace2GoItem> = ({ place, setPlaces2Go, places2Go, drag }) => {
  const navigation = useNavigation();
  const [todosOpen, setTodosOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [editingNewTodo, setEditingNewTodo] = useState(false);
  const [todosList, setTodosList] = useState<ITodoItem[]>(place.todos);

  function prepareAnimation() {
    LayoutAnimation.configureNext({
      duration: 100,
      create: { type: 'linear', property: 'opacity', delay: 100, duration: 200 },
      update: { type: 'linear', property: 'opacity', delay: 100, duration: 200 },
      delete: { type: 'linear', property: 'opacity', delay: 100, duration: 200 },
    });
  }

  const handleArrowPress = () => {
    prepareAnimation();
    setTodosOpen(!todosOpen);
  }

  const handleNewTodoItemPress = () => {
    setEditingNewTodo(true);
  }

  const handleDeletePlace = async () => {
    Alert.alert(
      'Tem certeza?',
      `${place.name} e todos os registros serão apagados`,
      [
        {
          text: 'Nope',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: async () => {
            const response = await deletePlace(place.id);
            if (response === 'Error') {
              Alert.alert('Algum erro ocorreu ao tentar buscar dados.', 'Reveja sua conexão com a rede');
              return;
            }
            if (todosOpen) {
              handleArrowPress();
            }
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );
            let newArr = [...places2Go];
            const index = newArr.findIndex(item => item.id === place.id);
            newArr.splice(index, 1);
            setPlaces2Go(newArr);
            await AsyncStorage.removeItem(place.name);
          },
        },
      ],
      { cancelable: true },
    );
  }

  const handleAddNewTodo = (newTodo: ITodoItem) => {
    prepareAnimation();
    setTodosList([...todosList, newTodo]);
  }

  const handleRemoveTodo = (todoId: string) => {
    prepareAnimation();
    let newList = [...todosList];
    const index = newList.findIndex(item => item.id === todoId);
    newList.splice(index, 1);
    setTodosList(newList);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <View style={{marginBottom: 15, backgroundColor: '#00000080', borderRadius: 8}}>
        <TouchableOpacity
          style={styles.placeItemContainer}
          onPress={handleArrowPress} activeOpacity={1}
          onLongPress={() => !todosOpen && drag()}
        >
          <View style={styles.arrowContainer}>
            <Image 
              source={require('../assets/caretRightIcon.png')}
              style={[styles.caretRightIcon, todosOpen 
                ? 
                  { transform: [{ rotate: '90deg' }] }
                : 
                  { transform: [{ rotate: '0deg' }] }
              ]}/>
          </View>

          <TouchableOpacity 
            style={styles.textContainer}
            onPress={() => navigation.navigate('Photos', {
              placeName: place.name,
            })}
            onLongPress={() => !todosOpen && drag()}
          >
            <Text style={styles.placeItemText}>
              {place.name}
            </Text>
          </TouchableOpacity>

          <View style={styles.rightContainer}>
            <TouchableOpacity
              onPress={handleDeletePlace}
              onLongPress={() => !todosOpen && drag()}
            >
              <Text style={[styles.placeItemText, {marginLeft: 15}]}>X</Text>
            </TouchableOpacity>
            {place.who === 'kuma' 
            ?
              <Image source={require('../assets/kuma.png')} style={styles.placeItemUserImage}/>
            : 
              <Image source={require('../assets/eli.png')} style={styles.placeItemUserImage}/>
            }
          </View>
        </TouchableOpacity>
        {todosOpen && 
          <View style={styles.todosContainer}>
            <View style={styles.separationLine}/>
            <FlatList 
              scrollEnabled={false}
              data={todosList}
              renderItem={({ item }) => (
                <TodoItem 
                  done={item.done} 
                  name={item.name} 
                  placeId={place.id} 
                  handleAddNewTodo={handleAddNewTodo}
                  id={item.id}
                  handleRemoveTodo={handleRemoveTodo}  
                />
              )}
              keyExtractor={(item, index) => `draggable-item-${item.id}`}
            />
            

            {editingNewTodo 
              ?
                <>
                  <TodoItem
                    done={false}
                    name={''}
                    newTodo={true}
                    setEditingNewTodo={setEditingNewTodo}
                    placeId={place.id}
                    handleAddNewTodo={handleAddNewTodo}
                    handleRemoveTodo={handleRemoveTodo}
                  />
                </>
              :
                <>
                  <TouchableOpacity
                    style={styles.newTodoItemButton}
                    onPress={handleNewTodoItemPress}
                  >
                    <Text style={{fontSize: 14, color: '#eaeaea', textAlignVertical: 'center'}}>+</Text>
                  </TouchableOpacity>
                </>
            }

          </View>
        }
        
      </View>
    </KeyboardAvoidingView>
  );
};

export default Place2GoItem;

const styles = StyleSheet.create({
  placeItemContainer: {
    width: '100%',
    paddingVertical: 18,
    alignItems: 'center',
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  arrowContainer: {
    height: '100%',
    width: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 4
  },
  placeItemText: {
    fontSize: 18,
    color: '#eaeaea',
    fontWeight: 'bold',
    marginLeft: 17,
  },
  caretRightIcon: {
    width: 12,
    height: 20,
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeItemUserImage: {
    width: 25,
    height: 25,
    alignSelf: 'center',
  },
  todosContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  newTodoItemButton: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  separationLine: {
    height: 1,
    width: '100%',
    backgroundColor: '#242424',
  },
});