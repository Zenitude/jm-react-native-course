import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import React, { useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../constants";
import { useAppwrite } from "../../../hooks/useAppwrite";
import { deleteActivities, getUser } from "../../../lib/appwrite";
import { useLocalSearchParams, router, Link } from "expo-router";
import { Context } from "../../../context/GlobalProvider";

export default function Delete() {
  const { user } = useContext(Context)!;
  const { id } = useLocalSearchParams<{id: string}>();
  const { data: detailsUser, refetch, isLoading } = useAppwrite(getUser(id!));

  useEffect(() => {
    if(user.role !== "admin") { router.replace("/home") }
  }, [])

  useEffect(() => {
    refetch();
  }, [id])

  return (
    <SafeAreaView style={styles.area}>
      <ScrollView>
        { isLoading && (<Text>Loading user details ...</Text>) }
        { (detailsUser && detailsUser[0]) &&
          (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Delete activities user ?</Text>
                <Text style={styles.username}>{detailsUser[0].username}</Text>
              </View>
              <View style={styles.buttons}>
                <TouchableOpacity onPress={() => router.back()} style={styles.button}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  deleteActivities(id!, detailsUser[0].accountId);
                  router.replace("/users");
                }} style={styles.button}>
                    <Text style={styles.confirmText}>Confirm</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.infos}>Delete posts, files and sessions</Text>
              <View style={styles.back}>
                <Text style={styles.backText}>Go to the </Text>
                <Link href="/users" style={styles.backLink}>List users</Link>
              </View>
            </>
          )
        }
        
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  area: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.primary,
    paddingTop: 200
  },
  header: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10
  },
  title: {
    color: colors.grey[100],
    fontSize: 22,
  },
  username: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 26
  },
  buttons: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 20
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    borderRadius: 15,
  },
  cancelText: {
    borderRadius: 15,
    color: colors.primary,
    backgroundColor: colors.secondary.default,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 20,
    fontWeight: "bold"
  },
  confirmText: {
    borderRadius: 15,
    backgroundColor: colors.red.default,
    color: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 20,
    fontWeight: "bold"
  },
  infos: {
    color: colors.white,
    textAlign: "center",
    fontSize: 17,
    marginVertical: 20
  },
  back: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20
  },
  backText: {
    color: colors.white,
    fontSize: 18
  },
  backLink: {
    color: colors.secondary.default,
    fontSize: 18,
    fontWeight: "bold"
  }
})