import { Client, Account, Avatars, Databases, ID, Query, Storage, ImageGravity } from 'react-native-appwrite';
// import sdk from "node-appwrite";
import { ImagePickerAsset } from "expo-image-picker";

export const appwriteConfig = {
    endpoint: '',
    platform: '',
    projectId: '',
    databaseId: '',
    userCollectionId: '',
    videoCollectionId: '',
    storageId: '',

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
        const session = account.createEmailPasswordSession(email, password);
        return session;
    } catch(error: any) {
        console.log('Error Sign In :', error);
        throw new Error(error.message);
    }
}

export const createUser = async (type: string, email: string, password: string, username: string, role: string) => {
    try {
        const idUser = ID.unique();
        const newAccount = await account.create(idUser, email, password, username);
        const passwordHashed = password;

        if(!newAccount) throw Error;
        const avatarUrl = avatars.getInitials(username);

        if(type === "signup") {
            await signIn(email, password);
        }

        const newUser = await databases.createDocument(
            databaseId,
            userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl,
                role: role ? role : "member",
                password: passwordHashed
            }
        )
        return newUser;
    }
    catch(error: any) {
        console.log('Error Create User : ', error);
        throw new Error(error);
    }
}

export async function signOut() {
    try {
        const session = await account.deleteSession("current")
        return session;
    }
    catch(error) {
        console.log('Error Sign Out : ', error);
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
        console.log('Error Get Current User : ', error);
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
        console.log('Error Delete Video : ', error);
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
        console.log('Error Get All Posts : ', error)
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
        console.log('Error Get Latest Posts : ', error);
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
        console.log('Error Search Posts : ', error);
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
        console.log('Error Get User Posts : ', error);
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
        console.log('Error Get File Preview : ', error);
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
        console.log('Error Get Upload File : ', error);
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
        console.log('Error Create Video : ', error);
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
        console.log('Error Get Marks : ', error);
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
        console.log('Error Get Video : ', error);
        throw new Error(`Error Get Video : ${error}`)
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
        console.log('Error Update Video : ', error);
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
        console.log('Error Get All Users : ', error)
        throw new Error(`${error}`);
    }
}

export async function getUserByMail(email: string) {
    try{
        const users = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal("email", email)]
        )
        if(!users) throw new Error("Something went wrong")
     
        return users.documents;
    }
    catch(error) {
        console.log('Error Get User By Email : ', error)
        throw new Error(`${error}`);
    }
}

export async function getUser(userId: string) {
    try{
        const users = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal("$id", userId)]
        )
        if(!users) throw new Error("Something went wrong")
     
        return users.documents;
    }
    catch(error) {
        console.log('Error Get User : ', error)
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
        console.log('Error Get All Files : ', error)
        throw new Error(`${error}`);
    }
}

export async function deleteActivities(userId: string, accountId: string) {
    try {     
        //Delete Sessions
        const sessionsUsers = await account.listSessions();
        const filteredSessions = sessionsUsers.sessions.filter(el => el["userId"] === accountId);

        for(const session of filteredSessions) {
            await account.deleteSession(session["$id"])
        }

        //User videos datas in database
        const videos = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator', userId)]
        )

        //Delete Files
        let filesUser = <string[]>[];

        const documentsVideos = videos.documents;

        documentsVideos.forEach(doc => {
            const videoFilter1 = doc.video.split('https://cloud.appwrite.io/v1/storage/buckets//files/');
            const videoFilter2 = videoFilter1[1].split('/view?project=66607c8f002753f3a1a8');
            const idVideo = videoFilter2[0];

            const thumbFilter1 = doc.thumbnail.split('https://cloud.appwrite.io/v1/storage/buckets//files/');
            const thumbFilter2 = thumbFilter1[1].split('/preview?width=2000&height=2000&gravity=top&quality=100&project=');
            const idThumbnail = thumbFilter2[0]
            filesUser.push(idVideo, idThumbnail);
        })       

        for(const fileId of filesUser) {
            await storage.deleteFile(storageId, fileId)
        }

        //Delete Videos
        if(videos && videos.documents) {
            videos.documents.forEach(el => {
                databases.deleteDocument(
                    databaseId,
                    videoCollectionId,
                    el["$id"]
                )
            })
        }

        return videos;
    }
    catch(error) {
        console.log('Error Delete Activities : ', error);
        throw new Error(`Error Delete Activities : ${error}`)
    }
}

export async function deleteFile(fileId: string) {}

export async function verifPasswordAndEditUser(userId: string, datas: UserType, oldPassword: string) {
    try {
        await editUser(userId, datas, oldPassword);
    }
    catch(error) {
        //console.log('Error Verif Password And Edit User : ', error);
        throw new Error(`Error Verif Password And Edit User : ${error}`)
    }
}

export async function editUser(userId: string, datas: UserType, oldPassword?: string) {
    try {
        console.log("userId : ", userId);
        console.log("oldPassword : ", oldPassword);
        console.log("datas : ", datas);
        
        await account.updateName(datas.username);
        
        if(oldPassword) {
            await account.updateEmail(datas.email, oldPassword);
            await account.updatePassword(datas.password!, oldPassword);
        } else {
            await account.updateEmail(datas.email, datas.password!);
        }

        

        const updatedUser = await databases.updateDocument(
            databaseId,
            userCollectionId,
            userId,
            datas
        )

        return  updatedUser;
    }
    catch(error) {
        //console.log('Error Edit User : ', error);
        throw new Error(`Error Edit User : ${error}`)
    }
}

export async function updateUser(userId: string, datas: UserType, oldPassword: string) {
    try {
        const updatedUser = await databases.updateDocument(
            databaseId,
            userCollectionId,
            userId,
            datas
        )
        await account.updateEmail(datas.email, datas.password!);
        await account.updatePassword(datas.password!, oldPassword);
        await account.updateName(datas.username);

        return  updatedUser;
    }
    catch(error) {
        console.log('Error Update User : ', error);
        throw new Error(`Error Update User : ${error}`)
    }
}

export async function getInfosUser(userId: string) {
    const user = await getUser(userId);
    console.log('user : ', user)
    
    try {
        const videos = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator', userId)]
        )

        user[0].videos = videos.documents;
        
        return user;
    }
    catch(error) {
        //console.log('Error Get Infos User : ', error);
        throw new Error(`Error Get Infos User : ${error}`)
    }
}
