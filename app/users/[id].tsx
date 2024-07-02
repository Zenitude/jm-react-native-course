import { StyleSheet, Text, TextInput, View, Image, KeyboardTypeOptions, TouchableOpacity, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Models } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, icons } from "../../constants";
import { useAppwrite } from "../../hooks/useAppwrite";
import { getInfosUser } from "../../lib/appwrite";
import { useLocalSearchParams, router, Link } from "expo-router";
import { Context } from "../../context/GlobalProvider";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";

export default function Details() {
  const { user } = useContext(Context)!;
  const { id } = useLocalSearchParams<{id: string}>();
  const { data: detailsUser, refetch, isLoading } = useAppwrite(getInfosUser(id!));
  const [ dateTime, setDateTime ] = useState({date: "", time: ""})
  const [ infosUser, setInfosUser ] = useState<UserType>({
    avatar: "",
    id: "",
    accountId: "",
    username: "",
    email: "",
    role: "",
  })
  
  async function getDatas() {
    const decomposeTime = detailsUser[0].$createdAt ? detailsUser[0].$createdAt.split("T1") : [];
    const endTime = decomposeTime[1].slice(7)

    setDateTime({
      date: decomposeTime[0].split("-").reverse().join("/"),
      time: decomposeTime[1].replace(endTime, "")
    })
    
    setInfosUser({
      avatar: detailsUser[0].avatar,
      id: id,
      accountId: detailsUser[0].accountId,
      username: detailsUser[0].username,
      email: detailsUser[0].email,
      role: detailsUser[0].role,
    })
  }

  useEffect(() => {
    if(user.role !== "admin") { router.replace("/home") }
    getDatas();
  }, [])

  useEffect(() => {
    refetch()
  }, [id])
  
  return (
    <SafeAreaView style={mainStyles.area}>
      { isLoading && (<Text>Loading user details ...</Text>) }
      { (detailsUser && detailsUser[0]) && 
        (
          <FlatList
            data={detailsUser[0].videos}
            keyExtractor={(item) => item.creator}
            ListHeaderComponent={(item) => (
              <View style={headerStyles.container}>
                <Link href={"/users"}>Users</Link>
                <Text style={headerStyles.title}>User details of</Text>
                <Text style={subtitleStyle}>{infosUser.username}</Text>
                <Image style={headerStyles.avatar} source={infosUser.avatar} resizeMode="contain"/>
                <View style={headerStyles.detailsContainer}>
                  <Text style={headerStyles.label}>Id : <Text style={headerStyles.infos}>{infosUser.id}</Text></Text>
                  <Text style={headerStyles.label}>Account Id : <Text style={headerStyles.infos}>{infosUser.accountId}</Text></Text>
                  <Text style={headerStyles.label}>Username : <Text style={headerStyles.infos}>{infosUser.username}</Text></Text>
                  <Text style={headerStyles.label}>Email : <Text style={headerStyles.infos}>{infosUser.email}</Text></Text>
                  <Text style={headerStyles.label}>Role : <Text style={headerStyles.infos}>{infosUser.role}</Text></Text>
                  <Text style={headerStyles.label}>Join : <Text style={headerStyles.infos}>{dateTime.date} at {dateTime.time}</Text></Text>
                </View>
              </View>

            )}
            renderItem={(item) => (
              <VideoCard
                video={item}
                page={`/users/${id}`}
              />
            )}
            ListEmptyComponent={
              <EmptyState 
                title={"No Videos Found"}
                subtitle={"User has no created any post"}
                button={false}
              />
            }
          />
        )
      }
      

      {/* <Edit 
        edit={edit}
        label={"Username"}
        data={detailsUser[0].username}
        keyboard={"default"}
        setter={setUserData}
      /> */}

    </SafeAreaView>
  )
}

const mainStyles = StyleSheet.create({
  area: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.primary
  }
})

const headerStyles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 5
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
  label: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
    marginHorizontal: 10
  }
})

const subtitleStyle = StyleSheet.compose(headerStyles.subtitle, headerStyles.infos)