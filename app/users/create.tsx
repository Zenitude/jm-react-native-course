import { View, Text, Image, StyleSheet, ScrollView, GestureResponderEvent, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router"
import { colors, images } from "../../constants";
import { createUser } from "../../lib/appwrite";
import FormField from "../../components/FormField";
import SelectField from "../../components/SelectField";
import CustomButton from "../../components/CustomButton";
import { Context } from "../../context/GlobalProvider";

export default function Create() {
  const { setUser, setIsLoggedIn } = useContext(Context)!;
  const [form, setForm] = useState<FormFieldSetter>({ username: "", email: "", password: "", confirm: "", role: "member" })
  const [isSubmitting, setIsSubmitting] = useState(false);

  const options = [ 
    {title: "member"},
    {title: "admin"}
  ]

  const submit = async (e: GestureResponderEvent) => {
    if(!(form as SignType).username || !(form as SignType).email || !(form as SignType).password || !(form as SignType).confirm || !(form as SignType).role ) {
      Alert.alert('Error Create User', 'Please fill in all the fields')
    }
    setIsSubmitting(true);

    try {
      if((form as SignType).password === (form as SignType).confirm) {
        const result = await createUser("user", (form as SignType).email, (form as SignType).password, (form as SignType).username!, (form as SignType).role);
        setUser(result)
        setIsLoggedIn(true);
        router.replace('/users')
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

          <Text style={styles.text}>Create User</Text>

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

          <SelectField 
            data={options}
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
            title={'Create'}
            handlePress={submit}
            loading={isSubmitting}
          />

          <View style={styles.goto}>
            <Text style={styles.gotoText}>Return to the</Text>
            <Link href="/users" style={styles.links}>List users</Link>
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