import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "../constants";

export default function CustomButton({title, handlePress}: ButtonPropsIndex) {
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

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        width: "100%",
        minHeight: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary.default,
        borderRadius: 15,
        marginHorizontal: "auto"
      },
      text: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 20
      }
})