import { Client, Account, Avatars, Databases, ID, Query } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.zentech.aora',
    projectId: '66607c8f002753f3a1a8',
    databaseId: '66608c9700326b63f61f',
    userCollectionId: '66608cc8003b0ab91113',
    videoCollectionId: '66608d0e00169a12a184',
    storageId: '66608f7900002b723fbe'
}

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email: string, password: string, username: string) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, username);
        if(!newAccount) throw Error;
        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);
        
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl,

            }
        )

        return newUser;
    }
    catch(error: any) {
        console.log(error);
        throw new Error(error);
    }
}

export async function signIn(email: string, password: string) {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch(error: any) {
        console.log(error);
        throw new Error(error.message);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];

    }
    catch(error: any) {
        console.log(error);
        throw new Error(error);
    }
}


