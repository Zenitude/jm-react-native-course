import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { colors, images } from "../constants";
import CustomButton from "./CustomButton";

export default function EmptyState({title, subtitle, button}: EmptyStateProps) {
    return (
        <View style={styles.container}>
        <Image 
            source={images.empty}
            resizeMode={"contain"}
            style={styles.emptyImage}
        />

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        { 
            button 
            ? (<CustomButton 
                title={"Create Video"}
                handlePress={() => router.push('/create')}
            />)
            : (<></>)
    
        }
        
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