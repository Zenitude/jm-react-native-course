import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Models } from "react-native-appwrite";

export const useAppwrite = (fn: any) => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<Models.Document[]>([]);

    const fetchData = async () => {
        try { 
            const res = await fn;
            if(res.length > 0) {
                setIsLoading(true);
                setData(await res);
            } else {
                setIsLoading(false);
            }            
        }
        catch(error: any) { Alert.alert('Error Fetch', `${error.message}`) } 
        finally { setIsLoading(false); }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const refetch = () => fetchData();

    return { data, isLoading, refetch }
}