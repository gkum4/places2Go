import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Alert,
  Text,
} from 'react-native';

import { setNewTodoItem, deleteTodoItem, updateTodoItem } from '../services/httpRequests';

interface ITodo {
  name: string;
  done: boolean;
  id: string;
}

interface ITodoItem {
  name: string;
  done: boolean;
  newTodo?: boolean;
  setEditingNewTodo?: (value: boolean) => void;
  id?: string;
  placeId: string;
  handleAddNewTodo: (newTodo: ITodo) => void;
  handleRemoveTodo: (todoId: string) => void;
}

const TodoItem: React.FC<ITodoItem> = ({ 
  name, 
  done, 
  id,
  newTodo = false, 
  setEditingNewTodo, 
  placeId, 
  handleAddNewTodo,
  handleRemoveTodo,
}) => {
  const [checked, setChecked] = useState(false);
  const [inputValue, setInputValue] = useState(name);

  const handleCheck = async () => {
    if (!newTodo && id !== undefined) {
      const responseData = await updateTodoItem({
        id: id,
        done: !checked,
        name: inputValue,
      }, placeId);
    }
    setChecked(!checked);
  }

  const handleLoseFocus = async () => {
    if (newTodo && setEditingNewTodo !== undefined) {

      if (!!inputValue) {
        const todoId = await setNewTodoItem({
          name: inputValue,
          done: checked,
        }, placeId);
        if (todoId === 'Error') {
          Alert.alert('Algum erro ocorreu ao tentar buscar dados.', 'Reveja sua conexão com a rede');
          return;
        }
        console.log(todoId);
        handleAddNewTodo({done: false, name: inputValue, id: todoId});
      }
      setEditingNewTodo(false);
      
    } else {

      if (id !== undefined) {
        if (!!inputValue) {
          const responseData = await updateTodoItem({
            id: id,
            done: checked,
            name: inputValue,
          }, placeId);
          if (responseData === 'Error') {
            Alert.alert('Algum erro ocorreu ao tentar buscar dados.', 'Reveja sua conexão com a rede');
            return;
          }
        } else {
          const responseData = await deleteTodoItem(id, placeId);
          if (responseData === 'Error') {
            Alert.alert('Algum erro ocorreu ao tentar deletar tarefa.', 'Reveja sua conexão com a rede');
            return;
          }
          handleRemoveTodo(id);
        }
      }
    }
  }

  const handleXPress = () => {
    Alert.alert(
      'Tem certeza?',
      undefined,
      [
        {
          text: 'Nope',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: async () => {
            if (id !== undefined) {
              const responseData = await deleteTodoItem(id, placeId);
              if (responseData === 'Error') {
                Alert.alert('Algum erro ocorreu ao tentar deletar tarefa.', 'Reveja sua conexão com a rede');
                return;
              }
              handleRemoveTodo(id);
            }
          },
        },
      ],
      { cancelable: true },
    );
  }

  return (
    <>
      <TouchableOpacity style={styles.todoItemContainer} activeOpacity={1}>
        <TouchableOpacity onPress={handleCheck}>
          {checked
            ?
              <Image source={require('../assets/checkCircleDone.png')} style={styles.checkCircleIcon} />
            :
              <Image source={require('../assets/checkCircle.png')} style={styles.checkCircleIcon} />
          }
          
        </TouchableOpacity>
        <TextInput
          style={styles.todoItemText}
          value={inputValue}
          onChangeText={text => setInputValue(text)}
          onEndEditing={handleLoseFocus}
          autoFocus={newTodo}
          autoCapitalize="words"
          autoCorrect={false}
        />
        {!newTodo && id !== undefined &&
          <View style={styles.xIconContainer}>
            <TouchableOpacity onPress={handleXPress}>
              <Text style={styles.xText}>x</Text>
            </TouchableOpacity>
          </View>
        }
        
      </TouchableOpacity>
    </>
  );
}

export default TodoItem;

const styles = StyleSheet.create({
  separationLine: {
    height: 1,
    width: '100%',
    backgroundColor: '#242424',
  },
  todoItemContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 45,
    alignItems: 'center',
  },
  checkCircleIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  todoItemText: {
    color: '#eaeaea',
    fontSize: 14,
    width: '70%',
  },
  xIconContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  xText: {
    color: '#eaeaea',
    fontSize: 14,
    textAlignVertical: 'center',
  }
});