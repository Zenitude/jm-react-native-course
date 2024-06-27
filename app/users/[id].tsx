import { StyleSheet, Text, TextInput, View, Image, KeyboardTypeOptions, TouchableOpacity, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Models } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, icons } from "../../constants";
import { useAppwrite } from "../../hooks/useAppwrite";
import { getUser } from "../../lib/appwrite";
import { useLocalSearchParams, router } from "expo-router";
import { Context } from "../../context/GlobalProvider";

type EditProps = {
  edit: boolean;
  label: string;
  data: string;
  keyboard: KeyboardTypeOptions;
  setter: React.Dispatch<React.SetStateAction<Models.Document>>
}


const Edit = ({edit, label, data, keyboard, setter} : EditProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const changeText = (text: string) => setter((prev: Models.Document) => {
    const previous = {...prev};

    if(label === "Username") { previous.username = text}
    else if(label === "Email") { previous.email = text}
    else if(label === "Password") { previous.password = text}
    else if(label === "Confirm") { previous.confirm = text }
    else if(label === "Role") { previous.role = text}
    
    return previous;
  })

  if(edit) {
    return (
      <View style={editStyles.field}>
        <TextInput       
            autoCapitalize="none"
            style={editStyles.input}
            value={data}
            placeholder={""}
            placeholderTextColor={colors.placeholder}
            keyboardType={keyboard}
            onChangeText={changeText}
            secureTextEntry={(label === "Password" || label === "Confirm") && !showPassword}
        ></TextInput>
        {(label === "Password" || label === "Confirm") && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
            >
              <Image 
                source={showPassword ? icons.eyeHide : icons.eye}
                resizeMode="contain"
                style={editStyles.eye}
              />
            </TouchableOpacity>
          )}
      </View>
    )
  }
  else {<Text>{label} : {data}</Text>}
}

const editStyles = StyleSheet.create({
  field: {},
  input: {},
  eye: {},
})

//edit, label, data, keyboard, setter
export default function Details() {
  const { user } = useContext(Context)!;
  const { id } = useLocalSearchParams();
  const [edit, setEdit] = useState(false);
  const { data: detailsUser, refetch } = useAppwrite(getUser(typeof id === "string" ? id! : id!.join("")));
  const [userData, setUserData] = useState({
    email: "", 
    role: "member", 
    username: ""
  });
  //console.log('username : ', detailsUser ? detailsUser[0].$id : "pas trouvé")
  
  useEffect(() => {
    if(user.role !== "admin") { router.replace("/home") }
  }, [])

  useEffect(() => {
    refetch();
  }, [id])

  return (
    <SafeAreaView>
      <ScrollView>

      {/* <Edit 
        edit={edit}
        label={"Username"}
        data={detailsUser[0].username}
        keyboard={"default"}
        setter={setUserData}
      /> */}

      {/* <Edit 
        edit={edit}
        label={"Email"}
        data={detailsUser[0].username}
        keyboard={"Email Address"}
        setter={setUserData}
      /> */}

      {/* <Edit 
        edit={edit}
        label={"Role"}
        data={detailsUser[0].role}
        keyboard={"default"}
        setter={setUserData}
      /> */}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {

  }
})