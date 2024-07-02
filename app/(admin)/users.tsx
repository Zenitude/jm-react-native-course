import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppwrite } from "../../hooks/useAppwrite";
import { getAllUsers, deleteUser } from "../../lib/appwrite";
import { colors, icons } from "../../constants";
import { Context } from "../../context/GlobalProvider";
import { router } from "expo-router";

export default function users() {
  const { user } = useContext(Context)!;
  const { data: listUsers, refetch } = useAppwrite(getAllUsers());
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if(user.role !== "admin") {
      router.replace("/home")
    }
  }, [])

  return (
    <SafeAreaView style={mainStyles.main}>
      <FlatList
        data={listUsers}
        keyExtractor={(item) => item.$id}
        ListHeaderComponent={
          <View style={headerStyles.container}>
            <TouchableOpacity onPress={() => router.push("/users/create")} style={headerStyles.createTouch}>
              <Text style={headerStyles.textCreate}>Create</Text>
              <Image 
                source={icons.plus}
                resizeMode="contain"
                style={headerStyles.iconCreate}
              />
            </TouchableOpacity>
            <Text style={headerStyles.title}>Users</Text>
          </View>
        }
        renderItem={({item}) => (
          <View style={itemStyles.container}>
            <TouchableOpacity onPress={() => router.push(`/users/${item.$id}`)} style={itemStyles.userTouch}>
              <Image 
                source={{uri: item.avatar}}
                resizeMode="contain"
                style={itemStyles.avatar}
              />
              <Text style={itemStyles.username}>{item.username}</Text>
            </TouchableOpacity>
            <View style={itemStyles.actions}>
              {
                user.$id === item.$id && (
                  <TouchableOpacity onPress={() => router.push(`/users/edit/${item.$id}`)}>
                    <Image 
                      source={icons.edit}
                      resizeMode="contain"
                      style={itemStyles.iconEdit}
                      />
                  </TouchableOpacity>
                )
              }
              <TouchableOpacity onPress={() => router.push(`/users/delete/${item.$id}`)}>
                <Image 
                  source={icons.basket}
                  resizeMode="contain"
                  style={itemStyles.iconDelete}
                  />
              </TouchableOpacity>
            </View>
          </View>
        )}
        
      />
    </SafeAreaView>
  )
}

const mainStyles = StyleSheet.create({
  main: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.primary,
    position: "relative"
  },
})

const headerStyles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 50,
  },
  createTouch: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    paddingRight: 15
  },
  textCreate: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold"
  },
  iconCreate: {
    width: 25,
    height: 25,
  },
  title: {
    width: "100%",
    textAlign: "center",
    color: colors.white,
    fontWeight: "bold",
    fontSize: 30,
  }
})

const itemStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    borderBottomColor: colors.grey[100],
    borderBottomWidth: 1,
    borderStyle: "dashed",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  userTouch: {
    flexDirection: "row",
    gap: 10
  },
  avatar: {
    width: 25,
    height: 25,
    borderColor: colors.secondary.default,
    borderWidth: 1,
    padding: 2,
    borderRadius: 5
  },
  username: {
    color: colors.white,
    fontSize: 20
  },
  actions: {
    flexDirection: "row",
    gap: 5,
  },
  iconEdit: {
    width: 25,
    height: 25
  },
  iconDelete: {
    width: 25,
    height: 25
  },
})