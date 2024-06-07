import { getAllPosts } from "@/lib/appwrite";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Models } from "react-native-appwrite";

export const useAppwrite = (fn: any) => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<Models.Document[]>([]);

    const fetchData = async () => {
        setIsLoading(true);

        try { setData(await fn()); }
        catch(error: any) { Alert.alert('Error', `${error.message}`) } 
        finally { setIsLoading(false); }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const refetch = () => fetchData();

    return { data, isLoading, refetch }
}