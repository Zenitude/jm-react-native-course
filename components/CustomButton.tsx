import React from "react";
import { TouchableOpacity, Text } from "react-native";


export default function CustomButton({title, handlePress, styles}: ButtonPropsIndex) {
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