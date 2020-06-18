import React, { useContext, useState, createContext, useCallback } from 'react';

interface IUserContext {
  userName: string;
  logIn(newName: string): void;
}

const UserContext = createContext<IUserContext>({} as IUserContext);

export const UserProvider: React.FC = ({children}) => {
  const [userName, setUserName] = useState('');

  const logIn = useCallback((newName: string): void => {
    setUserName(newName);
  }, []);

  return (
    <UserContext.Provider value={{ userName, logIn }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  return context;
}