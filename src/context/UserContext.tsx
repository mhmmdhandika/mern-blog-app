import { createContext, useState } from 'react';

export const UserContext = createContext<object | any>({});

export const UserContextProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [userInfo, setUserInfo] = useState<{
    id: string;
    username: string;
  } | null>(null);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
