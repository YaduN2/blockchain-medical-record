"use client";

import {createContext , useState , ReactNode} from 'react';

export const appContext = createContext<[number, React.Dispatch<React.SetStateAction<number>>] | null>(null);

function AppContextProvider({children}: {children: ReactNode}) {
  const [isLogged , setIsLogged] = useState(0);

  //0 ->  not logged in
  //1 ->  logged in as patient
  //2 ->  logged in as doctor
  return (
      <appContext.Provider value={[isLogged , setIsLogged]}>
        {children}
      </appContext.Provider>

    )
}

export default AppContextProvider
