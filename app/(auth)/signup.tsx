import { View, Text, Image, StyleSheet, ScrollView, GestureResponderEvent, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router"
import { colors, images } from "../../constants";
import { createUser } from "../../lib/appwrite";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Context } from "../../context/GlobalProvider";

export default function Signup() {
  const { setUser, setIsLoggedIn } = useContext(Context)!;
  const [form, setForm] = useState<FormFieldSetter>({ username: "", email: "", password: "", confirm: "" })
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: GestureResponderEvent) => {
    if(!(form as SignType).username || !(form as SignType).email || !(form as SignType).password || !(form as SignType).confirm ) {
      Alert.alert('Error Signup', 'Please fill in all the fields')
    }
    setIsSubmitting(true);

    try {
      if((form as SignType).password === (form as SignType).confirm) {
        const result = await createUser((form as SignType).email, (form as SignType).password, (form as SignType).username!);
        setUser(result)
        setIsLoggedIn(true);
        router.replace('/home')
      } else {
        Alert.alert('Error Signup', 'Password and Confirm are different')
      }
    }
    catch(error: any) { Alert.alert('Error Signup', error.message); } 
    finally { setIsSubmitting(false); }
  }

  return (
    <SafeAreaView style={styles.area}>
      <ScrollView>
        <View style={styles.container}>

          <Image 
            source={images.logo}
            resizeMode="contain"
            style={styles.logo}
          />

          <Text style={styles.text}>Sign up to Aora</Text>

          <FormField 
            title={"Username"} 
            value={(form as SignType).username!} 
            placeholder=""
            keyboard="default"
            setter={setForm}
          />

          <FormField 
            title={"Email"} 
            value={(form as SignType).email} 
            placeholder="example@mail.com"
            keyboard="email-address" 
            setter={setForm}
          />

          <FormField 
            title={"Password"} 
            value={(form as SignType).password} 
            placeholder=""
            keyboard="default" 
            setter={setForm}
          />

          <FormField 
            title={"Confirm"} 
            value={(form as SignType).confirm!} 
            placeholder=""
            keyboard="default" 
            setter={setForm}
          />

          <CustomButton
            title={'Sign Up'}
            handlePress={submit}
            loading={isSubmitting}
          />

          <View style={styles.goto}>
            <Text style={styles.gotoText}>Have an account ?</Text>
            <Link href="/signin" style={styles.links}>Sign In</Link>
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
    paddingTop: 115,
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