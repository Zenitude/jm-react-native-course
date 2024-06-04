import { View, Text, Image, StyleSheet, ScrollView, NativeSyntheticEvent, TextInputChangeEventData, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, images } from "../../constants";
import FormField from "../../components/FormField";

export default function Signin() {
  const [form, setForm] = useState<FormType>({
    email: "",
    password: ""
  })

  return (
    <SafeAreaView style={styles.area}>
      <ScrollView>
        <View style={styles.container}>

          <Image 
            source={images.logo}
            resizeMode="contain"
            style={styles.logo}
          />

          <Text style={styles.text}>Log in to Aora</Text>

          <FormField 
            title={"Email"} 
            value={form.email} 
            placeholder=""
            keyboard="email-address" 
            setter={[form, setForm]}
          />

          <FormField 
            title={"Password"} 
            value={form.password} 
            placeholder=""
            keyboard="visible-password" 
            setter={[form, setForm]}
          />

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  area: {
    flexGrow: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    flexGrow: 1,
    paddingHorizontal: 7,
    marginVertical: 10
  },
  logo: {
    width: 115,
    height: 35
  },
  text: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20
  },
  field: {
    marginTop: 10
  }
})