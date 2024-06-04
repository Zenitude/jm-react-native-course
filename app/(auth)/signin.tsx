import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router"
import { colors, images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

export default function Signin() {
  const [form, setForm] = useState<FormType>({ email: "", password: "" })
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = () => {}

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
            setter={setForm}
          />

          <FormField 
            title={"Password"} 
            value={form.password} 
            placeholder=""
            keyboard="default" 
            setter={setForm}
          />

          <CustomButton
            title={'Sign In'}
            handlePress={submit}
            styles={styleButton}
            loading={isSubmitting}
          />

          <View style={styles.goto}>
            <Text style={styles.gotoText}>Don't have account ?</Text>
            <Link href="/signup" style={styles.links}>Sign Up</Link>
          </View>

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
    paddingTop: 135,
  },
  container: {
    justifyContent: 'center',
    width: 'auto',
    flexGrow: 1,
    padding: 10,
    marginVertical: 10
  },
  logo: {
    width: 115,
    height: 35
  },
  text: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20
  },
  field: {
    marginTop: 10
  },
  goto: {
    paddingTop: 20,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gotoText: {
    color: colors.grey[100],
    fontSize: 16
  },
  links: {
    color: colors.secondary.default,
    fontSize: 16,
    fontWeight: 'bold'
  }
})

const styleButton = {
  container: {
    marginTop: 20,
    minWidth: 280,
    maxWidth: 305,
    minHeight: 62,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary.default,
    borderRadius: 50
  },
  text: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 20
  }
}