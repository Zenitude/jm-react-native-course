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

const { endpoint, platform, projectId, databaseId, userCollectionId, videoCollectionId, storageId } = appwriteConfig;

const client = new Client();

client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setPlatform(platform)
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export async function signIn(email: string, password: string) {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch(error: any) {
        console.log(error);
        throw new Error(error.message);
    }
}

export const createUser = async (email: string, password: string, username: string) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, username);
        if(!newAccount) throw Error;
        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);
        
        const newUser = await databases.createDocument(
            databaseId,
            userCollectionId,
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

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;
        const currentUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
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

export async function getAllPosts() {
    try{
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId
        )

        return posts.documents;
    }
    catch(error) {
        throw new Error(`${error}`);
    }
}

export async function getLatestPosts() {
    try{
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt'), Query.limit(7)]
        )

        return posts.documents;
    }
    catch(error) {
        throw new Error(`${error}`);
    }
}
