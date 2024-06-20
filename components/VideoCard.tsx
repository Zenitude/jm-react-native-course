import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Models } from "react-native-appwrite";
import { colors, icons } from "../constants";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";

type VideoCardProps = {
    video: Models.Document
}

export default function VideoCard({video: {title, thumbnail, prompt, video, creator: { username, avatar}}}: VideoCardProps) {
    const [play, setPlay] = useState(false);
    
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

                <View style={styles.menu}>
                    <Image 
                        source={icons.menu}
                        resizeMode="contain"
                        style={styles.iconMenu}
                    />
                </View>
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
        paddingRight: 5,
        marginBottom: 10
    }, 
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 2,
        marginTop: 20
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
    menu: {
        paddingTop: 5,
    },
    iconMenu: {
        width: 15,
        height: 15
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
    }
})