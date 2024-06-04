import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState} from "react";
import { colors, icons } from "../constants";

export default function FormField({title, value, placeholder, keyboard, setter }: FormFieldType) {
  const [showPassword, setShowPassword] = useState(false);

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
            onChangeText={(text: string) => setter((prev: FormType) => {
              const previous = {...prev};
              if(title === "Email") { previous.email = text}
              else if(title === "Username") { previous.username = text}
              else if(title === "Password") { previous.password = text}
              else if(title === "Confirm") { previous.confirm = text}
              return previous;
            })}
            secureTextEntry={title === "Password" && !showPassword}
        ></TextInput>
        {title === 'Password' && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
            >
              <Image 
                source={showPassword ? icons.eyeHide : icons.eye}
                resizeMode="contain"
                style={styles.eye}
              />
            </TouchableOpacity>
          )}
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
        width: '100%',
        minWidth: 280,
        height: 45,
        paddingHorizontal: 5,
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
        marginTop: 10
    },
    eye: {
      width: 25,
      height: 25

    }
})