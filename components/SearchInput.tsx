import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState} from "react";
import { colors, icons } from "../constants";

export default function SearchInput({value, placeholder, keyboard, setter }: SearchInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const changeText = (text: string) => setter(text);

  return (
    <View style={styles.field}>
      <TextInput       
        autoCapitalize="none"
        style={styles.textField}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        keyboardType={keyboard}
        onChangeText={changeText}
      ></TextInput>

      <TouchableOpacity
        onPress={() => setShowPassword(!showPassword)}
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