import { View, Text, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { colors } from "../../constants";
import VideoCard from "../../components/VideoCard";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { useAppwrite } from "../../hooks/useAppwrite";
import { searchPosts } from "../../lib/appwrite";

export default function Search() {
  const { query } = useLocalSearchParams();
  const { data: listPosts, refetch } = useAppwrite(searchPosts(typeof query === "string" ? query : query!.join("")));

  useEffect(() => {
    refetch();
  }, [query])

  return (
    <SafeAreaView style={styles.area}>
      <FlatList 
        style={styles.list}
        data={listPosts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
            <VideoCard 
            video={item}
            page={`/search/${query}`}
            />
        )}
        ListHeaderComponent={() => (
          <View style={styles.container}>
            <Text style={styles.textFirst}>Search Results</Text>
            <Text style={styles.textSecond}>{query}</Text>
            <View style={styles.containerInput}></View>
            <SearchInput initialQuery={typeof query === "string" ? query : query!.join("")} refetch={refetch} />
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
  container: {
    marginVertical: 6,
    paddingHorizontal: 4,
    gap: 6
  },
  containerInput: {
    marginTop: 10,
    marginBottom: 15
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