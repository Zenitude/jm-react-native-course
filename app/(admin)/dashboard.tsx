import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useContext, useState } from "react";
import { Context } from "../../context/GlobalProvider";
import { colors, icons } from "../../constants";
import { useAppwrite } from "../../hooks/useAppwrite";
import { getAllUsers, getAllPosts, getAllFiles, signOut } from "../../lib/appwrite";
import { router, Link } from "expo-router";

export default function Dashboard() {
  const { user, setUser, setIsLoggedIn } = useContext(Context)!;
  const { data: listUsers, refetch: refetchUsers } = useAppwrite(getAllUsers());
  const { data: listPosts, refetch: refetchPosts } = useAppwrite(getAllPosts());
  const { data: listFiles, refetch: refetchFiles } = useAppwrite(getAllFiles());
  const count = {
    gmail: listUsers.filter(el => el.email.endsWith("gmail.com")).length,
    marks: listPosts.map(el => el.bookmarks.length).reduce((acc, current) => acc + current, 0),
    likes: listPosts.map(el => el.likes.length).reduce((acc, current) => acc + current, 0),
    withLikes: listPosts.map(el => el.likes).filter(el => el.length > 0).length,
    noLikes: listPosts.map(el => el.likes).filter(el => el.length === 0).length,
    sizes: ((listFiles.map(el => el.sizeOriginal).reduce((acc, current) => acc + current, 0))/1000000).toFixed(2),
    mp4: listFiles.filter(el => el.mimeType === "video/mp4").length,
    sizeMp4: ((listFiles.filter(el => el.mimeType === "video/mp4").map(el => el.sizeOriginal).reduce((acc, current) => acc + current, 0))/1000000).toFixed(2),
    avi: listFiles.filter(el => el.mimeType === "video/avi").length,
    sizeAvi: ((listFiles.filter(el => el.mimeType === "video/avi").map(el => el.sizeOriginal).reduce((acc, current) => acc + current, 0))/1000000).toFixed(2),
    jpeg:listFiles.filter(el => el.mimeType === "image/jpeg").length,
    sizeJpeg: ((listFiles.filter(el => el.mimeType === "image/jpeg").map(el => el.sizeOriginal).reduce((acc, current) => acc + current, 0))/1000000).toFixed(2),
    png: listFiles.filter(el => el.mimeType === "image/png").length,
    sizePng: ((listFiles.filter(el => el.mimeType === "image/png").map(el => el.sizeOriginal).reduce((acc, current) => acc + current, 0))/1000000).toFixed(2),
    gif: listFiles.filter(el => el.mimeType === "image/gif").length,
    sizeGif: ((listFiles.filter(el => el.mimeType === "image/png").map(el => el.sizeOriginal).reduce((acc, current) => acc + current, 0))/1000000).toFixed(2)
  }
  console.log(listUsers[0])
  useEffect(() => {
    if(user.role !== "admin") {
      router.replace("/home")
    }
  }, [])

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
    <SafeAreaView style={mainStyles.area}>
      <ScrollView>

        <View style={headerStyles.header}>
          <View style={headerStyles.head}>
            <View style={headerStyles.titles}>
              <Text style={headerStyles.title}>Welcome back</Text>
              <View style={headerStyles.user}>
                <Image 
                  source={{uri: user?.avatar }}
                  resizeMode="cover"
                  style={headerStyles.avatar}
                  />
                <Text style={headerStyles.subtitle}>{user.username}</Text>
              </View>
            </View>
            <View style={headerStyles.logoutContainer}>
            <TouchableOpacity onPress={() => router.push("/home")}>
                <Image 
                  source={icons.home}
                  resizeMode="contain"
                  style={headerStyles.home}
                  />
              </TouchableOpacity>
              <TouchableOpacity onPress={logout}>
                <Image 
                  source={icons.logout}
                  resizeMode="contain"
                  style={headerStyles.logout}
                  />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      
        <View style={sectionStyles.section}>
          <Text style={sectionStyles.sectionTitle}>Users</Text>
          <View style={sectionStyles.content}>
            <View style={sectionStyles.actions}>
              <Link href={"/users"} style={sectionStyles.links}>Listing users</Link>
              <Link href={"/users/create"} style={sectionStyles.links}>Create user</Link>
            </View>
            <View style={sectionStyles.countContainer}>
              <Text style={sectionStyles.countTitle}>Counting</Text>
              <View>
                <Text style={sectionStyles.count}>{listUsers.length} Users</Text>
                <Text style={sectionStyles.count}>{count.gmail} use Gmail</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={sectionStyles.section}>
          <Text style={sectionStyles.sectionTitle}>Posts</Text>
          <View style={sectionStyles.content}>
            <View style={sectionStyles.actions}>
                <Link href={"/posts"} style={sectionStyles.links}>Listing posts</Link>
            </View>
            <View style={sectionStyles.countContainer}>
              <Text style={sectionStyles.countTitle}>Counting</Text>
              <View>
                <Text style={sectionStyles.count}>{listPosts.length} Posts</Text>
                <Text style={sectionStyles.count}>{count.marks} Marks </Text>
                <Text style={sectionStyles.count}>{count.likes} Likes </Text>
                <Text style={sectionStyles.count}>{count.withLikes} with Likes </Text>
                <Text style={sectionStyles.count}>{count.noLikes} with 0 Likes </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={sectionStyles.section}>
          <Text style={sectionStyles.sectionTitle}>Files</Text>
          <View style={sectionStyles.content}>
            <View style={sectionStyles.actions}>
              <Link href={"/files"} style={sectionStyles.links}>Listing files</Link>
            </View>
            <View style={sectionStyles.countContainer}>
              <Text style={sectionStyles.countTitle}>Counting</Text>
              <View>
                <Text style={sectionStyles.count}>{listFiles.length} Files ({count.sizes} MB)</Text>
                <Text style={sectionStyles.count}>{count.mp4} Mp4 ({count.sizeMp4} MB)</Text>
                <Text style={sectionStyles.count}>{count.avi} Avi ({count.sizeAvi} MB)</Text>
                <Text style={sectionStyles.count}>{count.jpeg} Jpeg ({count.sizeJpeg} MB)</Text>
                <Text style={sectionStyles.count}>{count.png} Png ({count.sizePng} MB)</Text>
                <Text style={sectionStyles.count}>{count.gif} Gif ({count.sizeGif} MB)</Text>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const mainStyles = StyleSheet.create({
  area: {
    backgroundColor: colors.primary,
    height: '100%',
    alignItems: 'center',
    paddingTop: 25,
    paddingHorizontal: 10
  },
  text: {
    color: colors.white
  },
})

const headerStyles = StyleSheet.create({
  header: {
    width: "100%",
    marginBottom: 15,
  },
  head: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titles: {
    flexDirection: "column",
    gap: 5,
  },
  title: {
    color: colors.grey[100],
    fontSize: 18
  },
  user: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  avatar: {
    width: 35,
    height: 35,
    borderColor: colors.secondary.default,
    borderWidth: 2,
    borderRadius: 5
  },
  subtitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  logoutContainer: {
    flexDirection: "row",
    gap: 10
  },
  logout: {
    width: 25,
    height: 25
  },
  home: {
    width: 25,
    height: 25
  }
})

const sectionStyles = StyleSheet.create({
  section: {
    width: "100%",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomColor: colors.grey[100],
    borderBottomWidth: 2
  },
  sectionTitle: {
    width: "100%",
    color: colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  actions: {
    flexDirection: "column",
    gap: 5,
  },
  links: {
    color: colors.white,
  },
  countContainer: {
    flexDirection: "column",
    gap: 5,
    borderLeftWidth: 1,
    borderLeftColor: colors.grey[100],
    height: "100%",
    width: "50%",
    paddingLeft: 10
  },
  countTitle: {
    color: colors.grey[100],
    fontSize: 14,
    textAlign: "center",
    borderBottomColor: colors.grey[100],
    borderBottomWidth: 1,
    paddingBottom: 5
    
  },
  count: {
    color: colors.white,
    fontSize: 18,
  }
})