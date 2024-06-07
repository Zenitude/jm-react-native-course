import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { colors, images } from "../constants";
import CustomButton from "./CustomButton";

type EmptyStateProps = {
    title: string;
    subtitle: string;
}

export default function EmptyState({title, subtitle}: EmptyStateProps) {
    return (
        <View style={styles.container}>
        <Image 
            source={images.empty}
            resizeMode={"contain"}
            style={styles.emptyImage}
        />

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <CustomButton 
            title={"Create Video"}
            handlePress={() => router.push('/create')}
            styles={styleButton}
        />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    emptyImage: {
        width: 270,
        height: 215
    },
    title: {
        color: colors.white,
        fontSize: 20,
        textAlign: 'center',
        marginTop: 5
    },
    subtitle: {
        color: colors.grey[100],
        fontSize: 14
    }
})

const styleButton = {
    container: {
      marginTop: 20,
      minWidth: 280,
      maxWidth: 305,
      minHeight: 62,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.secondary.default,
      borderRadius: 50
    },
    text: {
      color: colors.primary,
      fontWeight: 'bold',
      fontSize: 20
    }
  }