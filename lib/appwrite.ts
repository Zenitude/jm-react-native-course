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
        console.log('Error Sign In :', error);
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
        console.log('Error Create User : ', error);
        throw new Error(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) { throw new Error('Account not found')};
        console.log('account : ', currentAccount)

        const currentUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        console.log('user : ', currentUser)
        if(!currentUser) { throw new Error(`User not found`) };

        return currentUser.documents[0];

    }
    catch(error: any) {
        console.log('Error Get Current User : ', error);
        return null;
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
        //console.log('Error Get All Posts : ', error)
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
        //console.log('Error Get Latest Posts : ', error);
        throw new Error(`${error}`);
    }
}

export async function searchPosts(query: string) {
    try{
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        )

        if(!posts) throw new Error("Something went wrong")
            
        return posts.documents;
    }
    catch(error) {
        //console.log('Error Search Posts : ', error);
        throw new Error(`${error}`);
    }
}

export async function getUserPosts(userId: string) {
    try{
        if(userId) {

            const posts = await databases.listDocuments(
                databaseId,
                videoCollectionId,
                [Query.equal('creator', userId)]
            )
            
            if(!posts) throw new Error("Something went wrong")
                
                return posts.documents;
        } else { return []}
    }
    catch(error) {
        console.log('Error Get User Posts : ', error);
        throw new Error(`${error}`);
    }
}

export async function signOut() {
    try {
        const session = await account.deleteSession("current")
        return session;
    }
    catch(error) {
        //console.log('Error Sign Out : ', error);
        throw new Error(`${error}`)
    }
}