import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect} from "react";
import { colors } from "../constants";

export default function InfoBox({title, subtitle}: InfoBoxProps) {
  return (
    <View style={styles.container}>
      <Text style={subtitle ? styles.secondaryTitle : styles.primaryTitle}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
    },
    primaryTitle: {
        fontSize: 20,
        textAlign: "center",
        color: colors.white,
        fontWeight: "bold",
    },
    secondaryTitle: {
        fontSize: 16,
        textAlign: "center",
        color: colors.white
    },
    subtitle: {
        fontSize: 12,
        color: colors.grey[100],
    }
})