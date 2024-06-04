import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from "react-native";
import React from "react";
import { colors } from "../constants";

export default function FormField({title, value, placeholder, keyboard, setter }: FormFieldType) {
  const [form, setForm] = setter;
  return (
    <View style={styles.container}>
      <Text style={styles.textField}>{title}</Text>

      <View style={styles.field}>
        <TextInput 
            style={styles.textField}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={colors.placeholder}
            keyboardType={keyboard}
            onChangeText={(text: string) => setForm((prev: FormType) => {
              const previous = {...prev};
              if(title === 'Email') {previous.email = text} 
              else if(title === 'Password') {previous.password = text}
              return previous;
            })}
        ></TextInput>
      </View>
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
        minWidth: 280,
        height: 35,
        paddingHorizontal: 10,
        backgroundColor: colors.black[100],
        borderWidth: 1,
        borderColor: colors.black[200],
        borderRadius: 50,
         
    },
    textField: {
        flexGrow: 1,
        color: colors.white,
        marginTop: 10
    }
})