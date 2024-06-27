import { StyleSheet, Text, TextInput, View, Image, KeyboardTypeOptions, TouchableOpacity, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, icons } from "../../../constants";
import { useAppwrite } from "../../../hooks/useAppwrite";
import { deleteUser, getUser } from "../../../lib/appwrite";
import { useLocalSearchParams, router, Link } from "expo-router";
import { Context } from "../../../context/GlobalProvider";

export default function Delete() {
  const { user } = useContext(Context)!;
  const { id } = useLocalSearchParams();
  const { data: detailsUser, refetch } = useAppwrite(getUser(typeof id === "string" ? id! : id!.join("")));

  useEffect(() => {
    if(user.role !== "admin") { router.replace("/home") }
  }, [])

  useEffect(() => {
    refetch();
  }, [id])

  return (
    <SafeAreaView style={styles.area}>
      <ScrollView>
        <View style={styles.header}>
            <Text >Delete user {detailsUser[0].username} ?</Text>
        </View>
        <View style={styles.buttons}>
            <TouchableOpacity onPress={() => router.push("/users")} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteUser(detailsUser[0].$id, detailsUser[0].accountId)} style={styles.confirmButton}>
                <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
        </View>
        <Text>If you delete user, you also delete all his posts</Text>
        <View style={styles.back}>
            <Text style={styles.backText}>Return to the </Text>
            <Link href="/signup" style={styles.backLink}>List users</Link>
          </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  area: {},
  header: {},
  title: {},
  buttons: {},
  cancelButton: {},
  cancelText: {},
  confirmButton: {},
  confirmText: {},
  back: {},
  backText: {},
  backLink: {}
})