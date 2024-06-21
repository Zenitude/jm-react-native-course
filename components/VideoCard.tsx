import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { colors, icons } from "../constants";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { Context } from "../context/GlobalProvider";
import { updateVideo } from "../lib/appwrite";

export default function VideoCard({video: { $id: videoId, title, thumbnail, prompt, video, creator: {  $id: userId, username, avatar }, bookmarks }}: VideoCardProps) {
    const { user } = useContext(Context)!;
    const [play, setPlay] = useState(false);
    const [displayMenu, setDisplayMenu] = useState(false);
    const [marks, setMarks] = useState(bookmarks ?? []);

    const modifyMarks = () => {

        setMarks((prev : string[]) => {
            let previous = [...prev];
            if(previous.length === 0 || !previous.includes(user.$id)) {
                previous.push(user.$id);
            } else if(previous.includes(user.$id)) {
                const filteredMarks = previous.filter(el => el !== user.$id);
                previous = filteredMarks;
            }
            return previous;
        })

        const updatedVideo = {
            title: title,
            thumbnail: thumbnail,
            prompt: prompt,
            creator: userId,
            video: video,
            bookmarks: marks
        }
        
        updateVideo(videoId, updatedVideo);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.subHeader}>
                    <View style={styles.AvatarContainer}>
                        <Image 
                            source={{uri: avatar}}
                            resizeMode="cover"
                            style={styles.avatar}
                        />
                    </View>

                    <View style={styles.informations}>
                        <Text style={styles.title} numberOfLines={1}>{title}</Text>
                        <Text style={styles.username} numberOfLines={1}>{username}</Text>
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
                            <TouchableOpacity onPress={modifyMarks} style={styles.touch}>
                                <Image 
                                    source={marks.includes(userId) ? icons.mark : icons.unmark}
                                    resizeMode="contain"
                                    style={styles.iconMark}
                                />
                                <Text style={styles.textMenu}>Favoris</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (<></>)
                }

                
            </View>

            {
                play 
                ? (
                    <Video 
                    source={{uri: video}}
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
                ) 
                : (
                    <TouchableOpacity 
                        style={styles.containerThumb}
                        activeOpacity={0.5}
                        onPress={() => setPlay(true)}
                    >
                        <Image 
                            source={{uri: thumbnail}}
                            resizeMode="cover"
                            style={styles.thumbnail}
                        />
                        <Image 
                            source={icons.play}
                            resizeMode="contain"
                            style={styles.iconPlay}
                        />
                    </TouchableOpacity>
                )
            }
        </View>
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
        minHeight: 75,
        top: 15,
        right: 15,
        zIndex: 10,
        borderWidth: 1,
        borderColor: colors.grey[100],
        backgroundColor: colors.primary,
        paddingTop: 15,
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
        width: 25,
        height: 25
    }
})