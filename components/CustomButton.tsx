import { TouchableOpacity, Text, GestureResponderEvent } from 'react-native'
import React from 'react'
import { colors } from "../constants";

type ButtonProps = {
    title: string;
    handlePress: ((event: GestureResponderEvent) => void) | undefined
    styles: {
        container: {}
        text: {}
    }
}

export default function CustomButton({title, handlePress, styles}: ButtonProps) {
    return (
    <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.7}
        style={styles.container}
    >
        <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}