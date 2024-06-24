import { View, Text, Image, StyleSheet, FlatList, RefreshControl } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import VideoCard from "../../components/VideoCard";
import EmptyState from "../../components/EmptyState";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import { useAppwrite } from "../../hooks/useAppwrite";
import { Context } from "../../context/GlobalProvider";

export default function Home() {
  const { user } = useContext(Context)!;
  const [refreshing, setRefreshing] = useState(false);
  const { data: listPosts, refetch } = useAppwrite(getAllPosts());
  const { data: latestPosts } = useAppwrite(getLatestPosts());
  
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
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
            page={"home"}
          />
        )}
        ListHeaderComponent={() => (
          <View style={styles.container}>
            <View style={styles.viewInContainer}>
              <View>
                <Text style={styles.textFirst}>Welcome Back</Text>
                <Text style={styles.textSecond}>{user?.username}</Text>
              </View>

              <View style={styles.viewImage}>
                <Image 
                  source={images.logoSmall}
                  resizeMode="contain"
                  style={styles.logo}
                />
              </View>
            </View>

            <SearchInput />

            <View style={styles.viewSubtitle}>
              <Text style={styles.subtitle}>Latest Videos</Text>
              <Trending 
                posts={latestPosts ?? []}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title={"No Videos Found"}
            subtitle={"Be the first one to upload video"}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
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
  container: {
    marginVertical: 6,
    paddingHorizontal: 4,
    gap: 6
  },
  viewInContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 6
  },
  textFirst: {
    color: colors.grey[100],
    fontSize: 16,
  },
  textSecond: {
    color: colors.white,
    fontSize: 28,
    fontWeight: 'bold'
  },
  viewImage: {
    marginTop: 10,
  },
  logo: {
    width: 40,
    height: 40
  },
  viewSubtitle: {
    width: '100%',
    paddingTop: 35,
    paddingBottom: 18
  }, 
  subtitle: {
    color: colors.grey[100],
    fontSize: 18,
    marginBottom: 15
  }
})