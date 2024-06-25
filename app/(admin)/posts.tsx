import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Modal } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppwrite } from "../../hooks/useAppwrite";
import { getAllPosts, deleteVideo } from "../../lib/appwrite";
import { colors, icons } from "../../constants";
import { Context } from "../../context/GlobalProvider";
import { router } from "expo-router";

export default function users() {
  const { user } = useContext(Context)!;
  const { data: listPosts, refetch } = useAppwrite(getAllPosts());
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if(user.role !== "admin") {
      router.replace("/home")
    }
  }, [])

  return (
    <SafeAreaView style={mainStyles.main}>
      <FlatList
        data={listPosts}
        keyExtractor={(item) => item.$id}
        ListHeaderComponent={
          <View style={headerStyles.container}>
            <TouchableOpacity onPress={() => router.push("/create")} style={headerStyles.createTouch}>
              <Text style={headerStyles.textCreate}>Create</Text>
              <Image 
                source={icons.plus}
                resizeMode="contain"
                style={headerStyles.iconCreate}
              />
            </TouchableOpacity>
            <Text style={headerStyles.title}>Posts</Text>
          </View>
        }
        renderItem={({item: post}) => (
          <View style={itemStyles.container}>
            <TouchableOpacity onPress={() => router.push(`/posts/${post.$id}`)} style={itemStyles.titleTouch}>
              <Text style={itemStyles.title}>{post.title}</Text>
            </TouchableOpacity>
            <View style={itemStyles.actions}>
              <TouchableOpacity onPress={() => setModal(true)}>
                <Image 
                  source={icons.basket}
                  resizeMode="contain"
                  style={itemStyles.iconDelete}
                  />
              </TouchableOpacity>
              <Modal
                animationType={"fade"}
                transparent={true}
                visible={modal}
                onRequestClose={() => {
                  setModal(false);
                }}
              >
                <View style={itemStyles.modalContent}>
                  <View style={itemStyles.headerModal}>
                    <TouchableOpacity onPress={() => setModal(false)} style={itemStyles.closeModal}>
                      <Text style={itemStyles.closeModalText}>X</Text>
                    </TouchableOpacity>
                    <Text style={itemStyles.titleModal}>Delete user {user.username} ?</Text>
                  </View>
                  <View style={itemStyles.buttonsContainer}>
                    <TouchableOpacity onPress={() => setModal(false)} style={itemStyles.cancelModal}>
                      <Text style={itemStyles.cancelModalText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteVideo(post.$id)} style={itemStyles.confirmModal}>
                      <Text style={itemStyles.confirmModalText}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={itemStyles.infos}>You delete only the post, not its files</Text>
                </View>
              </Modal>
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
  titleTouch: {
    flexDirection: "row",
    gap: 10
  },
  title: {
    color: colors.white,
    fontSize: 20
  },
  actions: {
    flexDirection: "row",
    gap: 5,
  },
  iconDelete: {
    width: 25,
    height: 25
  },
  modalContent: {
    width: 260,
    paddingHorizontal: 5,
    paddingTop: 5,
    paddingBottom: 10,
    backgroundColor: colors.black[200],
    gap: 10,
    borderColor: colors.grey[100],
    borderWidth: 2,
    position: "absolute",
    top: "50%",
    left: "25%",
    borderRadius: 5
  },
  headerModal: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  titleModal: {
    color: colors.white,
    fontWeight: "bold",
    width: "100%",
    textAlign: "center"
  },
  closeModal: {
    backgroundColor: colors.grey[100],
    height: 25,
    width: 25,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end"
  },
  closeModalText: {
    color: colors.white,
    fontWeight: "bold",
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  cancelModal: {
    backgroundColor: colors.secondary.default,
    height: 35,
    width: 80,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  cancelModalText: {
    color: colors.black.default,
    fontWeight: "bold",
  },
  confirmModal: {
    backgroundColor: colors.red.default,
    height: 35,
    width: 80,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  confirmModalText: {
    color: colors.white,
    fontWeight: "bold",
  },
  infos: {
    color: colors.white,
    fontSize: 12,
    textAlign: "center"
  }
})