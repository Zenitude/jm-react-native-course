import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState} from "react";
import { colors, icons } from "../constants";

export default function FormField({title, value, placeholder, keyboard, setter }: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const changeText = (text: string) => setter((prev: FormFieldSetter) => {
    const previous = {...prev};

    if(title === "Email") { (previous as SignType).email = text}
    else if(title === "Username") { (previous as SignType).username = text}
    else if(title === "Password") { (previous as SignType).password = text}
    else if(title === "Confirm") { (previous as SignType).confirm = text}
    else if(title === "Video Title") { (previous as CreateVideoType).title = text}
    else if(title === "AI prompt") { (previous as CreateVideoType).prompt = text}
    
    return previous;
  })

  return (
    <View style={styles.container}>
      <Text style={styles.textField}>{title}</Text>

      <View style={styles.field}>
        <TextInput       
            autoCapitalize="none"
            style={styles.textField}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={colors.placeholder}
            keyboardType={keyboard}
            onChangeText={changeText}
            secureTextEntry={(title === "Password" || title === "Confirm") && !showPassword}
        ></TextInput>
        {(title === "Password" || title === "Confirm") && (
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
        gap: 10,
        marginTop: 10,
        marginBottom: 20
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