import { FlatList, StyleSheet, TouchableOpacity, ImageBackground, Image, ViewToken } from "react-native";
import { Models } from "react-native-appwrite";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import * as Animatable from "react-native-animatable";
import React, { useState, useEffect } from "react";
import { colors, icons } from "../constants";

type TrendingItemProps = {
  activeItem: string | Models.Document,
  item: Models.Document;
}

const TrendingItem = ({activeItem, item}: TrendingItemProps) => {
  const [play, setPlay] = useState(false);
  const [styleImgBG, setStyleImgBg] = useState(styles.imageBg);

  useEffect(() => {
    const verifActive = (verif: boolean) => {
      if(verif) setStyleImgBg({...styleImgBG, transform: [{scale: 1.2}]})
      else setStyleImgBg({...styleImgBG, transform: [{scale: 0.9}]})
    }

    if(typeof activeItem === "string") verifActive(activeItem === item.$id);
    else verifActive(activeItem.$id === item.$id);

  }, [activeItem])

  return(
    <Animatable.View
      style={styles.animatedItem}
    >
      {
        play
        ? (
          <Video 
            source={{uri: item.video}}
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
          <TouchableOpacity style={styles.poster} activeOpacity={0.7} onPress={() => setPlay(true)} >
            <ImageBackground 
              source={{uri: item.thumbnail}}
              style={styleImgBG}
              resizeMode="cover"
            />
            <Image 
              source={icons.play}
              style={styles.play}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )
      }
    </Animatable.View>
  )
  

}

type ViewableItemsProps = {
  viewableItems: ViewToken<Models.Document>[];
}

export default function Trending({posts}: TrendingProps) {
  const [activeItem, setActiveItem] = useState<string | Models.Document>(posts[0])

  const viewableItemsChanged = ({viewableItems}: ViewableItemsProps) => {

    if(viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key)
    }
  }

  return (
    <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <TrendingItem 
            activeItem={activeItem}
            item={item}
          />
        )}
        horizontal={true}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70
        }}
        contentOffset={{x: 150, y: 0}}
        onViewableItemsChanged={viewableItemsChanged}
    
    />
  )
}

const styles = StyleSheet.create({
    text: {
        color: colors.white,
    },
    animatedItem: {
      marginRight: 40
    },
    poster: {
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
      overflow: 'hidden'
    },
    imageBg: {
      width: 194,
      height: 234,
      marginVertical: 10,
      shadowColor: colors.black.default,
      shadowOpacity: 15,
      shadowOffset: {width: 5, height: 5},
      transform: [{scale: 0.9}],
      borderRadius: 15,
      overflow: 'hidden'
    },
    play: {
      width: 50,
      height: 50,
      position: 'absolute'
    },
    video: {
      flex: 1,
      width: 194,
      height: 254,
      borderRadius: 15,
      marginTop: 10,
      backgroundColor: colors.black[200]
    }
})