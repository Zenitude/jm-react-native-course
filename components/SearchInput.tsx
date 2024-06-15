import { View, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState} from "react";
import { colors, icons } from "../constants";
import { usePathname, router } from "expo-router";

export default function SearchInput({initialQuery, refetch }: SearchInputProps) {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery ?? "");

  const changeText = (text: string) => setQuery(text);

  return (
    <View style={styles.field}>
      <TextInput       
        autoCapitalize="none"
        style={styles.textField}
        value={query}
        placeholder={"Search a video topic"}
        placeholderTextColor={colors.placeholder}
        onChangeText={changeText}
      ></TextInput>

      <TouchableOpacity
        onPress={() => {
          if(!query) { return Alert.alert("Missing query", "Please input something to search results across database")}
          if(pathname.startsWith('/search')) { router.setParams({ query }) } 
          else { router.push(`/search/${query}`) }
        }}
      >
        <Image 
          source={icons.search}
          resizeMode="contain"
          style={styles.search}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        gap: 10
    }, 
    text: {
        color: colors.grey[100]
    },
    field: {
        width: '100%',
        minWidth: 280,
        height: 45,
        paddingHorizontal: 10,
        backgroundColor: colors.black[100],
        borderWidth: 1,
        borderColor: colors.white,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center'
         
    },
    textField: {
        flexGrow: 1,
        color: colors.white,
        marginTop: 5
    },
    search: {
      width: 25,
      height: 25
    }
})