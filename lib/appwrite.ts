import { Client, Account, Avatars, Databases, ID, Query, Storage, ImageGravity } from 'react-native-appwrite';
import { ImagePickerAsset } from "expo-image-picker";

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
const storage = new Storage(client);

// SignIn, SignUp, SignOut
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
                role: "member"
            }
        )
        return newUser;
    }
    catch(error: any) {
        //console.log('Error Create User : ', error);
        throw new Error(error);
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

// Get Current User
export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) { throw new Error('Account not found')};

        const currentUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        if(!currentUser) { throw new Error(`User not found`) };

        return currentUser.documents[0];
    }
    catch(error: any) {
        //console.log('Error Get Current User : ', error);
        return null;
    }
}

// All
export async function deleteVideo(videoId: string) {
    try {
        const video = await databases.deleteDocument(
            databaseId,
            videoCollectionId,
            videoId
        )

        if(!video) throw new Error('Video not found')
        return video
    }
    catch(error) {
        throw new Error(`Error Delete Video : ${error}`)
    }
}

// Home
export async function getAllPosts() {
    try{
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
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

// Profile
export async function getUserPosts(userId: string) {
    try{
        if(userId) {

            const posts = await databases.listDocuments(
                databaseId,
                videoCollectionId,
                [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
            )
            
            if(!posts) throw new Error("Something went wrong")
                
                return posts.documents;
        } else { return []}
    }
    catch(error) {
        //console.log('Error Get User Posts : ', error);
        throw new Error(`${error}`);
    }
}

// Create
export async function getFilePreview(fileId: string, type: string) {
    let fileUrl;

    try {
        if(type === 'video') {
            fileUrl = storage.getFileView(storageId, fileId)
        } else if(type === 'image') {
            fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, ImageGravity.Top, 100);
        } else {
            throw new Error('Invalid file type')
        }

        if(!fileUrl) throw new Error;
        return fileUrl;
    }
    catch(error) {
        throw new Error(`Error Get File Preview : ${error}`);
    }
}

export async function uploadFile(file: ImagePickerAsset, type: string) {
    if(!file) return;

    const asset = <AssetType>{
        name: file.fileName, 
        type: file.mimeType, 
        size: file.fileSize, 
        uri: file.uri
    };

    try{
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        )

        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    }
    catch(error) {
        throw new Error(`Error Upload File : ${error}`);
    }
}

export async function createVideo(form: CreateVideoType) {
    try{
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video')
        ]);

        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId,
                bookmarks: form.marks,
                likes: form.addLikes
            }
        )

        return newPost;
    }
    catch(error) {
        throw new Error(`Error create Video : ${error}`);
    }
}

// Bookmark
export async function getMarks(userId: string) {

    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.contains('bookmarks', userId)]  
        )

        return posts.documents;
    }
    catch(error) {
        throw new Error(`Error Get Favorite : ${error}`)
    }
}

export async function getVideo(videoId: string) {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('$id', videoId)]
        )

        return posts.documents[0];
    }
    catch(error) {
        throw new Error(`Error Get Favorite : ${error}`)
    }
}

// Favorites
export async function updateVideo(videoId: string, datas: VideoType) {
    try {
        const updatedVideo = await databases.updateDocument(
            databaseId,
            videoCollectionId,
            videoId,
            datas
        )

        return  updatedVideo;
    }
    catch(error) {
        throw new Error(`Error Get Favorite : ${error}`)
    }
}

// Admin
export async function getAllUsers() {
    try{
        const users = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.orderAsc('username')]
        )
        
        return users.documents;
    }
    catch(error) {
        //console.log('Error Get All Posts : ', error)
        throw new Error(`${error}`);
    }
}

export async function getAllFiles() {
    try{
        const files = await storage.listFiles(
            storageId
        )
        
        return files.files;
    }
    catch(error) {
        //console.log('Error Get All Posts : ', error)
        throw new Error(`${error}`);
    }
}



