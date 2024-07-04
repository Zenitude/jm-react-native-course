import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { colors, icons } from "../constants";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { Context } from "../context/GlobalProvider";
import { updateVideo, deleteVideo } from "../lib/appwrite";
import { router } from "expo-router";

export default function VideoCard({page, video}: VideoCardProps) {
    const { user } = useContext(Context)!;
    const [play, setPlay] = useState(false);
    const [displayMenu, setDisplayMenu] = useState(false);
    const [marks, setMarks] = useState((video && video.bookmarks) ? video.bookmarks : []);
    const [addLike, setAddLike] = useState((video && video.likes) ? video.likes : []);

    const modifyMarksOrLikes = async (type: string) => {

        if(type === "mark") {
            setMarks((prev : string[]) => {
                let previous = [...prev];
                if(previous.length === 0 || !previous.includes(user["$id"])) {
                    previous.push(user["$id"]);
                } else if(previous.includes(user["$id"])) {
                    const filteredMarks = previous.filter(el => el !== user["$id"]);
                    previous = filteredMarks;
                }
                return previous;
            })
        } else if (type === "like") {
            setAddLike((prev : string[]) => {
                let previous = [...prev];
                if(previous.length === 0 || !previous.includes(user["$id"])) {
                    previous.push(user["$id"]);
                } else if(previous.includes(user["$id"])) {
                    const filteredMarks = previous.filter(el => el !== user["$id"]);
                    previous = filteredMarks;
                }
                return previous;
            })
        }
        
        const updatedVideo = {
            title: video.title,
            thumbnail: video.thumbnail,
            prompt: video.prompt,
            creator: video.creator["$id"],
            video: video.video,
            bookmarks: marks,
            likes: addLike
        }
        
        updateVideo(video["$id"], updatedVideo);
        router.replace(`/${page}`);
    }

    return (
        <>
            {
                (video && video.title)
                ? (<View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.subHeader}>
                            <View style={styles.AvatarContainer}>
                                <Image 
                                    source={{uri: video.creator.avatar}}
                                    resizeMode="cover"
                                    style={styles.avatar}
                                />
                            </View>
        
                            <View style={styles.informations}>
                                <Text style={styles.title} numberOfLines={1}>{video.title}</Text>
                                <Text style={styles.username} numberOfLines={1}>{video.creator.username}</Text>
                            </View>
                        </View>
        
                        <View style={styles.iconMenuContainer}>
                            <TouchableOpacity onPress={() => setDisplayMenu(!displayMenu)}>
                                <Image 
                                    source={icons.menu}
                                    resizeMode="contain"
                                    style={styles.iconMenu}
                                />
                            </TouchableOpacity>
                        </View>
        
                        {
                            displayMenu ? (
                                <View style={styles.menu}>
                                    <TouchableOpacity onPress={() => modifyMarksOrLikes("mark")} style={styles.touch}>
                                        <Image 
                                            source={marks.includes(user["$id"]) ? icons.mark : icons.unmark}
                                            resizeMode="contain"
                                            style={styles.iconMark}
                                        />
                                        <Text style={styles.textMenu}>Favoris</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => modifyMarksOrLikes("like")} style={styles.touch}>
                                        <Image 
                                            source={addLike.includes(user["$id"]) ? icons.like : icons.unlike}
                                            resizeMode="contain"
                                            style={styles.iconLike}
                                        />
                                        <Text style={styles.textMenu}>Like</Text>
                                    </TouchableOpacity>
                                    {
                                        video.creator["$id"] === user["$id"]
                                        ? (<TouchableOpacity onPress={() => {
                                            deleteVideo(video["$id"])
                                            router.replace(`/${page}`);
                                            Alert.alert('Success', 'Video has been deleted successfully')
                                        }} style={styles.touch}>
                                            <Image 
                                                source={icons.basket}
                                                resizeMode="contain"
                                                style={styles.iconDelete}
                                            />
                                            <Text style={styles.textMenu}>Delete</Text>
                                        </TouchableOpacity>)
                                        : (<></>)
                                    }
                                    
                                </View>
                            ) : (<></>)
                        }
        
                        
                    </View>
        
                    {
                        play 
                        ? (
                            <View style={styles.containerVideo}>
                                <Video 
                                source={{uri: video.video}}
                                style={styles.video}
                                resizeMode={ResizeMode.CONTAIN}
                                useNativeControls={true}
                                shouldPlay={true}
                                onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
                                    if(status.isLoaded && status.didJustFinish) {
                                        setPlay(false)
                                    }
                                }}
                                />
                            </View>
                        ) 
                        : (
                            <TouchableOpacity 
                                style={styles.containerThumb}
                                activeOpacity={0.5}
                                onPress={() => setPlay(true)}
                            >
                                <Image 
                                    source={{uri: video.thumbnail}}
                                    resizeMode="cover"
                                    style={styles.thumbnail}
                                />
                                <Image 
                                    source={icons.play}
                                    resizeMode="contain"
                                    style={styles.iconPlay}
                                />
                                <View style={styles.containerLike}>
                                    <Image 
                                        source={addLike.includes(user["$id"]) ? icons.like : icons.likeVideo}
                                        resizeMode="contain"
                                        style={styles.iconLikeVideo}
                                    />
                                    <Text style={styles.countLikes}>{(addLike.length >= 1000 ) ? `${addLike.length/1000} k` : `${addLike.length}`}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                </View>)
                : (<Text>No video</Text>)

            }
        </>
    )
}

const styles = StyleSheet.create({
    text: { color: colors.white},
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 10,
        width: "99%"
    }, 
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 2,
        marginTop: 20,
        position: 'relative',
    }, 
    subHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexGrow: 1,
    }, 
    AvatarContainer: {
        width: 40,
        height: 40,
        borderWidth: 2,
        borderColor: colors.secondary.default,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 10
    },
    informations: {
       justifyContent: 'center',
       flexGrow: 1,
       marginLeft: 10,
       rowGap: 1 ,
    },
    title: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 12,
    }, 
    username: {
        color: colors.grey[100],
        fontSize: 12
    },
    iconMenuContainer: {
        paddingTop: 5
    },
    iconMenu: {
        width: 15,
        height: 15
    },
    menu: {
        position: 'absolute',
        width: 150,
        top: 15,
        right: 15,
        zIndex: 10,
        borderWidth: 1,
        borderColor: colors.grey[100],
        backgroundColor: colors.primary,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        borderRadius: 15
    },
    textMenu: {
        color: colors.white
    },
    containerThumb: {
        width: "100%",
        height: 200,
        marginTop: 10,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'
    },
    thumbnail: {
        width: "100%",
        height: "100%",
        borderRadius: 20,
        marginTop: 10
    }, 
    iconPlay: {
        width: 50,
        height: 50,
        position: 'absolute'
    },
    video: {
        flex: 1,
        width: "100%",
        height: 200,
        borderRadius: 15,
        marginTop: 10,
        backgroundColor: colors.black[200]
    },
    touch: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    iconMark: {
        width: 15,
        height: 15
    },
    containerVideo: {
        position: 'relative'
    },
    iconLike: {
        width: 15,
        height: 15
    },
    textLike: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '600'
    },
    containerLike: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 15,
        left: 15,
        gap: 5,
    },
    iconLikeVideo: {
        width: 25,
        height: 25,
    },
    countLikes: {
        fontSize: 20,
        color: colors.white,
        fontWeight: "bold"
    },
    iconDelete: {
        width: 15,
        height: 15
    }
})