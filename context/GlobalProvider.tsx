import { createContext, useState, useEffect } from "react";
import { Models } from "react-native-appwrite";
import { getCurrentUser } from "../lib/appwrite";

export const Context = createContext<ContextType | null>(null);

export default function GlobalProdiver({children}: ProviderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<Models.Document | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
        .then((res) => {
            if(res) { 
                setIsLoggedIn(true)
                setUser(res)
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        })
        .catch((error) => console.log(error))
        .finally(() => {
            setIsLoading(false);
        })

    }, [])

    return (
        <Context.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading }}>
            {children}
        </Context.Provider>
    )
}