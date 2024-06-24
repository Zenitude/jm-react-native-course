import { View, Text, StyleSheet, FlatList, Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useContext, useState } from "react";
import { Context } from "../../context/GlobalProvider";
import { colors, icons, images } from "../../constants";
import VideoCard from "../../components/VideoCard";
import EmptyState from "../../components/EmptyState";
import { useAppwrite } from "../../hooks/useAppwrite";
import { getMarks } from "../../lib/appwrite";

export default function Profile() {
  const { user } = useContext(Context)!;
  const [refreshing, setRefreshing] = useState(false);
  const { data: listPosts, refetch } = useAppwrite(getMarks(user?.$id));

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
              page={"bookmark"}
            />
        )}
        ListHeaderComponent={() => (
          <View style={styles.container}>
            <View style={styles.viewInContainer}>
              <View>
                <Text style={styles.textFirst}>Your favorite posts</Text>
                <Text style={styles.textSecond}>Bookmark</Text>
              </View>

              <View style={styles.viewImage}>
                <Image 
                  source={images.logoSmall}
                  resizeMode="contain"
                  style={styles.logo}
                />
              </View>
            </View>

          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title={"No Videos Found"}
            subtitle={"you have not marked any post"}
            button={false}
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
  touchHeader: { 
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  logout: {
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