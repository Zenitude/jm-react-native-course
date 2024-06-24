import { View, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useContext } from "react";
import { Context } from "../../context/GlobalProvider";
import { colors, icons } from "../../constants";
import VideoCard from "../../components/VideoCard";
import EmptyState from "../../components/EmptyState";
import { useAppwrite } from "../../hooks/useAppwrite";
import { getUserPosts, signOut } from "../../lib/appwrite";
import InfoBox from "../../components/InfoBox";
import { router } from "expo-router";

export default function Profile() {
  const { user, setUser, setIsLoggedIn } = useContext(Context)!;
  const { data: listPosts, refetch } = useAppwrite(getUserPosts(user?.$id));

  const logout = async () => {
    try{ 
      setUser(null);
      setIsLoggedIn(false);
      await signOut();
      router.replace("/signin");
    }
    catch(error) { throw new Error(`Error Sign Out profile : ${error}`)}
  }

  return (
    <SafeAreaView style={styles.area}>
      <FlatList 
        style={styles.list}
        data={listPosts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
            <VideoCard 
            video={item}
            page={"profile"}
            />
        )}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <View style={styles.dashAndLogout}>
              {
                user.role === "admin"
                && (
                  <TouchableOpacity onPress={() => router.push("/dashboard")}>
                    <Image 
                      source={icons.dashboard}
                      resizeMode="contain"
                      style={styles.dashboard}
                    />
                  </TouchableOpacity>
                )
              }

              <TouchableOpacity onPress={logout}>
                <Image 
                  source={icons.logout}
                  resizeMode="contain"
                  style={styles.logout}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.containerAvatar}>
              <Image 
                source={{uri: user?.avatar }}
                resizeMode="cover"
                style={styles.avatar}
              />
            </View>

            <InfoBox title={user?.username} />

            <View style={styles.subtitle}>
              <InfoBox title={listPosts.length || 0} subtitle={"Posts"} />
              <InfoBox title={"1.2k"} subtitle={"Followers"} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title={"No Videos Found"}
            subtitle={"No videos found for this search query"}
          />
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  area: {
    backgroundColor: colors.primary,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 25,
    paddingHorizontal: 10
  },
  list: {
    width: '100%',
  },
  text: {
    color: colors.white
  },
  header: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 14,
    paddingHorizontal: 7
  },
  dashAndLogout: {
    width: "100%",
    justifyContent: "flex-end",
    flexDirection: "row",
    marginBottom: 10,
    gap: 10
  },
  logout: {
    width: 25,
    height: 25
  },
  dashboard: {
    borderWidth: 2,
    borderColor: colors.secondary.default,
    borderRadius: 5,
    width: 25,
    height: 25
  },
  containerAvatar: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: colors.secondary.default,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: "90%",
    height: "90%",
    borderRadius: 5
  },
  subtitle: {
    marginBottom: 5,
    flexDirection: "row",
    gap: 10
  }
})