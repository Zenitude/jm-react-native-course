import { View, Text, FlatList, StyleSheet } from "react-native";
import React from "react";
import { colors } from "../constants"

export default function Trending({posts}: TrendingProps) {
  return (
    <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
            <Text style={styles.textList}>{item.id}</Text>
        )}
        horizontal={true}
    
    />
  )
}

const styles = StyleSheet.create({
    textList: {
        color: colors.white,
    }
})