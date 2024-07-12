import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity, RefreshControl, Alert, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, icons } from "../../../constants";
import { useAppwrite } from "../../../hooks/useAppwrite";
import { getInfosUser, editUser, verifPasswordAndEditUser } from "../../../lib/appwrite";
import { useLocalSearchParams, router, Link } from "expo-router";
import { Context } from "../../../context/GlobalProvider";
import EmptyState from "../../../components/EmptyState";

export default function Details() {
  const { user } = useContext(Context)!;
  const { id } = useLocalSearchParams<{id: string}>();
  const { data: detailsUser, refetch, isLoading } = useAppwrite(getInfosUser(id!));
  const [refreshing, setRefreshing] = useState(false);
  const [ edit, setEdit ] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [ infosUser, setInfosUser ] = useState({
    username: (detailsUser && detailsUser[0]) ? detailsUser[0].username : "",
    email: (detailsUser && detailsUser[0]) ? detailsUser[0].email : "",
    role: (detailsUser && detailsUser[0]) ? detailsUser[0].role : "",
    oldPassword: "",
    password: "",
    confirm: "",
  })
  const count = {
    marks: (detailsUser && detailsUser[0]) ? detailsUser[0].videos.map((el: any) => el.bookmarks.length).reduce((acc: number, current: number) => acc + current, 0) : 0,
    likes: (detailsUser && detailsUser[0]) ? detailsUser[0].videos.map((el: any) => el.likes.length).reduce((acc: number, current: number) => acc + current, 0) : 0,
    withLikes: (detailsUser && detailsUser[0]) ? detailsUser[0].videos.map((el: any) => el.likes).filter((el: any) => el.length > 0).length : 0,
    noLikes: (detailsUser && detailsUser[0]) ? detailsUser[0].videos.map((el: any) => el.likes).filter((el: any) => el.length === 0).length : 0,
    withMarks: (detailsUser && detailsUser[0]) ? detailsUser[0].videos.map((el: any) => el.bookmarks).filter((el: any) => el.length > 0).length : 0,
    noMarks: (detailsUser && detailsUser[0]) ? detailsUser[0].videos.map((el: any) => el.bookmarks).filter((el: any) => el.length === 0).length : 0,
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  useEffect(() => {
    refetch();
  }, [edit])

  useEffect(() => {
    refetch()
  }, [id])

  const submit = () => {
    const datas = {
      username: infosUser.username !== ""? infosUser.username : detailsUser[0].username,
      email: infosUser.email !== "" ? infosUser.email : detailsUser[0].email,
      avatar: (detailsUser && detailsUser[0]) ? detailsUser[0].avatar : "", 
      accountId: (detailsUser && detailsUser[0]) ? detailsUser[0].accountId : "",
      role: infosUser.role !== "" ? infosUser.role : detailsUser[0].role,
      password: infosUser.password !== "" ? infosUser.password : detailsUser[0].password,
    }

    if(infosUser.password !== "") {
      if(infosUser.oldPassword !== detailsUser[0].password) {
        Alert.alert("Old password is wrong");
        return;
      } else if(infosUser.confirm !== infosUser.password) {
        Alert.alert("Password and Confirm are different");
        return;
      }
      else {
        verifPasswordAndEditUser(id!, datas, infosUser.oldPassword);
      }
    } else {
      editUser(id!, datas);
    }
    refetch();
  }
  
  return (
    <SafeAreaView style={mainStyles.area}>
      <ScrollView 
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        { isLoading && (<Text>Loading user details ...</Text>) }
        { (detailsUser && detailsUser[0]) && 
          (
            <>
              <View style={headerStyles.container}>
                    <Text style={headerStyles.title}>Your details user</Text>
                    <Text style={subtitleStyle}>{detailsUser[0].username}</Text>
                    <Image style={headerStyles.avatar} source={detailsUser[0].avatar} resizeMode="contain"/>
                    <View style={headerStyles.actions}>
                      <Text style={headerStyles.textAction}>Edit</Text>
                      <TouchableOpacity onPress={() => setEdit(!edit) }>
                        <Image 
                          source={edit ? icons.cancelEdit : icons.edit}
                          resizeMode="contain"
                          style={headerStyles.iconEdit}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={mainStyles.bigTitle}>Informations</Text>
                    <View style={headerStyles.detailsContainer}>

                      {/* CreatedAt */}
                      <View style={headerStyles.line}>
                        <Text style={headerStyles.label}>Join :</Text>
                        <Text style={headerStyles.infos}>
                          {new Date(detailsUser[0]["$createdAt"]).toLocaleString('en-GB')}
                        </Text>
                      </View>

                      {/* Username */}
                      <View style={headerStyles.edit}>
                        {
                          edit 
                          ? (
                            <View style={headerStyles.line}>
                              <Text style={headerStyles.label}>Username : </Text>
                              <View style={headerStyles.fieldContainer}>
                                <TextInput       
                                  autoCapitalize="none"
                                  style={headerStyles.field}
                                  value={infosUser.username ? infosUser.username : detailsUser[0].username}
                                  placeholder={"username"}
                                  placeholderTextColor={colors.placeholder}
                                  keyboardType={"default"}
                                  onChangeText={(text) => setInfosUser({...infosUser, username: text})}
                                ></TextInput>
                              </View>
                            </View>
                          )
                          : (
                            <View style={headerStyles.line}>
                              <Text style={headerStyles.label}>Username :</Text>
                              <Text style={headerStyles.infos}>{detailsUser[0].username}</Text>
                            </View>
                          )
                        }
                      </View>

                      {/* Email */}
                      <View style={headerStyles.edit}>
                        {
                          edit 
                          ? (
                            <View style={headerStyles.line}>
                              <Text style={headerStyles.label}>Email :</Text>
                              <View style={headerStyles.fieldContainer}>
                                <TextInput       
                                  autoCapitalize="none"
                                  style={headerStyles.field}
                                  value={infosUser.email ? infosUser.email : detailsUser[0].email}
                                  placeholder={"example@mail.com"}
                                  placeholderTextColor={colors.placeholder}
                                  keyboardType={"email-address"}
                                  onChangeText={(text) => setInfosUser({...infosUser, email: text})}
                                ></TextInput>
                              </View>
                            </View>
                          )
                          : (
                            <View style={headerStyles.line}>
                              <Text style={headerStyles.label}>Email :</Text>
                              <Text style={headerStyles.infos}>{detailsUser[0].email}</Text>
                            </View>
                          )
                        }
                      </View>
                      
                      {/* Role */}
                      <View style={headerStyles.edit}>
                        <View style={headerStyles.line}>
                          <Text style={headerStyles.label}>Role :</Text>
                          <Text style={headerStyles.infos}>{detailsUser[0].role}</Text>
                        </View>
                      </View>

                      {/* Passwords */}
                      {
                        edit 
                        && (
                          <>
                            {/* Old Password */}
                            <View style={headerStyles.edit}>
                              <View style={headerStyles.line}>
                                <Text style={headerStyles.label}>Old Password : </Text>
                                <View style={headerStyles.fieldContainer}>
                                  <TextInput       
                                    autoCapitalize="none"
                                    style={headerStyles.field}
                                    defaultValue={""}
                                    placeholder={""}
                                    placeholderTextColor={colors.placeholder}
                                    keyboardType={"default"}
                                    onChangeText={(text) => setInfosUser({...infosUser, oldPassword: text})}
                                    secureTextEntry={!showPassword}
                                  ></TextInput>
                                  <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={headerStyles.positionEye}
                                  >
                                    <Image 
                                      source={showPassword ? icons.eyeHide : icons.eye}
                                      resizeMode="contain"
                                      style={headerStyles.eye}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>

                            {/* New Password */}
                            <View style={headerStyles.edit}>
                              <View style={headerStyles.line}>
                                <Text style={headerStyles.label}>New Password : </Text>
                                <View style={headerStyles.fieldContainer}>
                                  <TextInput       
                                    autoCapitalize="none"
                                    style={headerStyles.field}
                                    defaultValue={""}
                                    placeholder={""}
                                    placeholderTextColor={colors.placeholder}
                                    keyboardType={"default"}
                                    onChangeText={(text) => setInfosUser({...infosUser, password: text})}
                                    secureTextEntry={!showPassword}
                                  ></TextInput>
                                  <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={headerStyles.positionEye}
                                  >
                                    <Image 
                                      source={showPassword ? icons.eyeHide : icons.eye}
                                      resizeMode="contain"
                                      style={headerStyles.eye}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>

                            {/* Confirm New Password */}
                            <View style={headerStyles.edit}>
                              <View style={headerStyles.line}>
                                <Text style={headerStyles.label}>Confirm : </Text>
                                <View style={headerStyles.fieldContainer}>
                                  <TextInput       
                                    autoCapitalize="none"
                                    style={headerStyles.field}
                                    defaultValue={""}
                                    placeholder={""}
                                    placeholderTextColor={colors.placeholder}
                                    keyboardType={"default"}
                                    onChangeText={(text) => setInfosUser({...infosUser, confirm: text})}
                                    secureTextEntry={!showPassword}
                                  ></TextInput>
                                  <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={headerStyles.positionEye}
                                  >
                                    <Image 
                                      source={showPassword ? icons.eyeHide : icons.eye}
                                      resizeMode="contain"
                                      style={headerStyles.eye}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          </>
                        )
                      }
                    
                      {/* Submit */}
                      {
                        edit 
                        && (
                            <TouchableOpacity onPress={() => submit()} style={headerStyles.submit}>
                              <Text style={headerStyles.textAction}>Valider les modifications</Text>
                              <Image 
                                source={icons.submitEdit}
                                resizeMode="contain"
                                style={headerStyles.iconSubmit}
                                />
                            </TouchableOpacity>
                        )
                      }
                      
                    </View>
              </View>
              <View style={videosStyles.container}>
                <Text style={mainStyles.bigTitle}>Videos</Text>
                {
                  detailsUser[0].videos.length > 0 
                  ? (
                    <>
                      <Text style={videosStyles.label}>Total posts : <Text style={videosStyles.infos}>{detailsUser[0].videos.length}</Text></Text>
                      <Text style={videosStyles.label}>Total likes : <Text style={videosStyles.infos}>{count.likes > 1000 ? `${(count.likes/1000).toFixed(2)} k` : count.likes}</Text></Text>
                      <Text style={videosStyles.label}>Total post with likes : <Text style={videosStyles.infos}>{count.withLikes}</Text></Text>
                      <Text style={videosStyles.label}>Total post 0 likes : <Text style={videosStyles.infos}>{count.noLikes}</Text></Text>
                      <Text style={videosStyles.label}>Total marks : <Text style={videosStyles.infos}>{count.likes > 1000 ? `${(count.marks/1000).toFixed(2)} k` : count.marks}</Text></Text>
                      <Text style={videosStyles.label}>Total post with marks : <Text style={videosStyles.infos}>{count.withMarks}</Text></Text>
                      <Text style={videosStyles.label}>Total post 0 marks : <Text style={videosStyles.infos}>{count.noMarks}</Text></Text>
                    </>
                  )
                  : (<Text>you have not created any post</Text>)
                }
              </View>
            </>
          )
        }
      </ScrollView>
    </SafeAreaView>
  )
}

const mainStyles = StyleSheet.create({
  area: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.primary,
    paddingBottom: 20
  },
  bigTitle: {
    fontWeight: "bold",
    fontSize: 28,
    color: colors.white,
    marginTop: 5,
    marginBottom: 10
  },
})

const headerStyles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 5,
    width: "100%",
  },
  actions: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    marginBottom: 20
  },
  textAction: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16
  },
  submit: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
  },
  back: {
    color: colors.secondary.default,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    color: colors.white,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 32,
    textAlign: "center"
  },
  infos: {
    color: colors.grey[100],
    fontWeight: "normal"
  },
  avatar: {
    width: 50,
    height: 50,
  },
  detailsContainer: {},
  edit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  iconEdit: {
    width: 25,
    height: 25,
  },
  iconSubmit: {
    width: 45,
    height: 45,
  },
  line: {
    width: "100%",
    paddingLeft: 15,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    gap: 10,
    flexWrap: "wrap",
  },
  label: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  fieldContainer: {
    borderColor: colors.grey[100],
    borderWidth: 1,
    borderRadius: 10,
    height: 35,
    flexGrow: 1
  },
  field: {
    width: "100%",
    color: colors.white,
    paddingLeft: 10,
  },
  eye: {
    width: "100%",
    height: "100%"
  },
  positionEye: {
    position: "absolute",
    right: 5,
    width: 25,
    height: 35,
  }
})

const subtitleStyle = StyleSheet.compose(headerStyles.subtitle, headerStyles.infos)

const videosStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    width: "100%",
  },
  label: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 15,
    marginVertical: 10
  },
  infos: {
    color: colors.grey[100]
  }
})

const selectStyles = StyleSheet.create({
  dropdownButtonStyle: {
    minWidth: 250,
    flexDirection: 'row',
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 35,
    alignItems: "center",
    justifyContent: "space-between"
  },
  dropdownButtonTxtStyle: {
    fontSize: 16,
    color: colors.white,
  },
  iconStyle: {
    width: 25,
    height: 25,
  },
  dropdownMenuStyle: {
    backgroundColor: colors.primary,
    borderColor: colors.grey[100],
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.white,
  },
  dropdownItemTxtStyle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.white,
  },
});