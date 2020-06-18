import api, { unsplashApi, geodbApi } from './api';

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

export async function getPlaces2Go(): Promise<IPlace2Go[] | string> {
  try {
    const { data } = await api.get('/places2go.json');

    if (data === null) {
      return [];
    }

    const placesKeys = Object.keys(data);

    let places: IPlace2Go[] = [];

    placesKeys.map((item) => {
      let todos: ITodoItem[] = [];

      if (!!data[item].todos) {
        const todosKeys = Object.keys(data[item].todos);

        todosKeys.map((todoId) => {
          todos.push({
            id: todoId, 
            name: data[item].todos[todoId].name,
            done: data[item].todos[todoId].done,
          });
        });
      }

      places.push({
        name: data[item].name,
        id: item,
        who: data[item].who,
        todos: todos,
      });
    });

    places.reverse();


    return places;
  } catch {
    return 'Error';
  }
}

export async function setNewPlaceToGo(newPlace: string, who: string): Promise<string> {
  try {
    const response = await api.post('/places2go.json', {
      name: newPlace,
      who: who,
    });

    return response.data;
  } catch {
    return 'Error';
  }
}

export async function deletePlace(placeId: string): Promise<string | null> {
  try {
    const response = await api.delete(`/places2go/${placeId}.json`);

    return response.data;
  } catch {
    return 'Error';
  }
}

export async function setNewTodoItem(todoItem: Omit<ITodoItem, 'id'>, placeId: string): Promise<string> {
  try {
    const response = await api.post(`/places2go/${placeId}/todos.json`, {
      name: todoItem.name,
      done: todoItem.done,
    });

    return response.data.name;
  } catch {
    return 'Error'
  }
}

export async function updateTodoItem(todoItem: ITodoItem, placeId: string): Promise<string | ITodoItem> {
  try {
    const response = await api.put(`/places2go/${placeId}/todos/${todoItem.id}.json`, {
      name: todoItem.name,
      done: todoItem.done,
    });

    return response.data;
  } catch {
    return 'Error'
  }
}

export async function deleteTodoItem(todoItemId: string, placeId: string): Promise<string | null> {
  try {
    const response = await api.delete(`/places2go/${placeId}/todos/${todoItemId}.json`);

    return response.data;
  } catch {
    return 'Error';
  }
}

export async function getImages(placeName: string, page: number = 1): Promise<object[] | string> {
  try {
    const response = await unsplashApi.get(`/search/photos?page=1&query=${placeName}`, { headers: { Authorization: 'Client-ID YOUR_ACCESS_KEY' } });
    const response2 = await unsplashApi.get(`/search/photos?page=2&query=${placeName}`, { headers: { Authorization: 'Client-ID YOUR_ACCESS_KEY' } });
    console.log('2 Unsplash request made');
    return [...response.data.results, ...response2.data.results];
  } catch {
    return 'Error';
  }
}

export async function getRandomCity(): Promise<string> {
  try {
    const responseTotal = await geodbApi.get('/v1/geo/cities?hateoasMode=off');
    const totalCount = responseTotal.data.metadata.totalCount;
    const randomNumber = Math.floor(Math.random() * totalCount);
    const response = await geodbApi.get(`/v1/geo/cities?limit=1&offset=${randomNumber}&hateoasMode=off`);
    return response.data.data[0].city + ' - ' + response.data.data[0].country;
  } catch {
    return 'Error';
  }
}