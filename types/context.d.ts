type ProviderProps = {
    children: React.ReactNode;
}

type ContextType = {
    isLoggedIn: boolean; 
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    user: Models.Document | null;
    setUser: React.Dispatch<React.SetStateAction<Models.Document | null>>;
    isLoading: boolean;
}