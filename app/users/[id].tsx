import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, icons } from "../../constants";
import { useAppwrite } from "../../hooks/useAppwrite";
import { getInfosUser, editRole } from "../../lib/appwrite";
import { useLocalSearchParams, router, Link } from "expo-router";
import { Context } from "../../context/GlobalProvider";
import EmptyState from "../../components/EmptyState";
import SelectDropdown from "react-native-select-dropdown";

export default function Details() {
  const { user } = useContext(Context)!;
  const { id } = useLocalSearchParams<{id: string}>();
  const { data: detailsUser, refetch, isLoading } = useAppwrite(getInfosUser(id!));
  const [refreshing, setRefreshing] = useState(false);
  const [ edit, setEdit ] = useState(false);
  const [ changeSelect, setChangeSelect ] = useState(false);
  const optionsRole = [{title: "admin"},{title: "member"}]
  const [ valueSelected, setValueSelected] = useState("");

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  useEffect(() => {
    if(user.role !== "admin") { router.replace("/home") }
  }, [])

  useEffect(() => {
    refetch();
  }, [edit])

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
            keyExtractor={(item) => item.creator + item["$id"]}
            ListHeaderComponent={(item) => (
              <View style={headerStyles.container}>
                <Link href={"/users"} style={headerStyles.back}>List users</Link>
                <TouchableOpacity onPress={() => router.push(`/users/delete/${detailsUser[0]["$id"]}`)} style={headerStyles.deleteUser}>
                  <Image 
                    source={icons.basket}
                    resizeMode="contain"
                    style={headerStyles.iconDelete}
                    />
                </TouchableOpacity>
                <Text style={headerStyles.title}>User details of</Text>
                <Text style={subtitleStyle}>{detailsUser[0].username}</Text>
                <Image style={headerStyles.avatar} source={detailsUser[0].avatar} resizeMode="contain"/>
                <Text style={headerStyles.bigTitle}>Informations</Text>
                <View style={headerStyles.detailsContainer}>
                  <Text style={headerStyles.label}>Id : <Text style={headerStyles.infos}>{id}</Text></Text>
                  <Text style={headerStyles.label}>Account Id : <Text style={headerStyles.infos}>{detailsUser[0].accountId}</Text></Text>
                  <Text style={headerStyles.label}>Username : <Text style={headerStyles.infos}>{detailsUser[0].username}</Text></Text>
                  <Text style={headerStyles.label}>Email : <Text style={headerStyles.infos}>{detailsUser[0].email}</Text></Text>
                  <View style={headerStyles.edit}>
                    <TouchableOpacity onPress={() => setEdit(!edit) }>
                      <Image 
                        source={edit ? icons.cancelEdit : icons.edit}
                        resizeMode="contain"
                        style={headerStyles.iconEdit}
                      />
                    </TouchableOpacity>
                    { edit 
                      ? (<Text style={headerStyles.label}>Role : <SelectDropdown
                        data={optionsRole}
                        onSelect={(selectedItem, index) => {
                          if(selectedItem.title === detailsUser[0].role) { setChangeSelect(false); } 
                          else { setChangeSelect(true); }
                          setValueSelected(selectedItem.title);
                        }}
                        defaultValueByIndex={optionsRole.findIndex((el) => el.title === detailsUser[0].role)}
                        renderButton={(selectedItem, isOpened) => {
                          return (
                            <View style={selectStyles.dropdownButtonStyle}>
                              <Text style={selectStyles.dropdownButtonTxtStyle}>
                                { valueSelected === "" 
                                  ? ((selectedItem && selectedItem.title) || 'Select Role')
                                  : (valueSelected)
                                }
                              </Text>
                              <Image 
                                source={isOpened ? icons.chevronUp : icons.chevronDown} 
                                resizeMode="contain"
                                style={selectStyles.dropdownButtonArrowStyle} 
                              />
                            </View>
                          );
                        }}
                        renderItem={(item, index, isSelected) => {
                          return (
                            <View style={{...selectStyles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                              <Text style={selectStyles.dropdownItemTxtStyle}>{item.title}</Text>
                            </View>
                          );
                        }}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={selectStyles.dropdownMenuStyle}
                      />
                      </Text>)
                      : (<Text style={headerStyles.label}>Role : <Text style={headerStyles.infos}>{detailsUser[0].role}</Text></Text>)
                    }
                    { changeSelect &&
                      (
                        <TouchableOpacity onPress={() => {
                          const datas = {
                            username: detailsUser[0].username,
                            email: detailsUser[0].email,
                            avatar: detailsUser[0].avatar,
                            accountId: detailsUser[0].accountId,
                            role: valueSelected,
                            password: detailsUser[0].password,
                          }
                          editRole(id!, datas);
                          detailsUser[0].role === valueSelected;
                        }}>
                        <Image 
                          source={icons.submitEdit}
                          resizeMode="contain"
                          style={headerStyles.iconSubmit}
                        />
                        </TouchableOpacity>
                      )
                    }
                  </View>
                  <Text style={headerStyles.label}>Join : <Text style={headerStyles.infos}>
                    {new Date(detailsUser[0]["$createdAt"]).toLocaleString('en-GB')}
                  </Text></Text>
                </View>
                <Text style={headerStyles.bigTitle}>Videos</Text>
              </View>

            )}
            renderItem={({item, index}) => (
              <View style={itemStyles.container}>
                <Text style={itemStyles.title}>Title: <Text style={itemStyles.info}>{item.title}</Text></Text>
                <Text style={itemStyles.likes}>Likes : <Text style={itemStyles.info}>{item.likes.length > 1000 ? `${((item.likes.length)/1000).toFixed(2)} k` : item.likes.length}</Text></Text>
                <Text style={itemStyles.marks}>Favoris : <Text style={itemStyles.info}>{item.bookmarks.length > 1000 ? `${((item.bookmarks.length)/1000).toFixed(2)} k` : item.bookmarks.length}</Text></Text>
              </View>
            )}
            ListEmptyComponent={
              <EmptyState 
                title={"No Videos Found"}
                subtitle={"User has no created any post"}
                button={false}
              />
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />
        )
      }

    </SafeAreaView>
  )
}

const mainStyles = StyleSheet.create({
  area: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.primary,
    paddingBottom: 20
  }
})

const headerStyles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 5
  },
  back: {
    color: colors.secondary.default,
    fontWeight: "bold",
  },
  deleteUser: {
    width: "100%",
    alignItems: "flex-end"
  },
  iconDelete: {
    width: 25,
    height: 25
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
  },
  bigTitle: {
    fontWeight: "bold",
    fontSize: 28,
    color: colors.white,
    marginTop: 5,
    marginBottom: 10
  },
  edit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingStart: 10
  },
  iconEdit: {
    width: 25,
    height: 25,
  },
  iconSubmit: {
    width: 25,
    height: 25,
  }
})

const subtitleStyle = StyleSheet.compose(headerStyles.subtitle, headerStyles.infos)

const itemStyles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 5,
    borderColor: colors.grey[100],
    borderStyle: "dashed",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 20
  },
  title: {
    color: colors.white,
    fontWeight: "bold",
    alignItems: "center"
  },
  likes: {
    color: colors.red.default,
    fontWeight: "bold",
  },
  marks: {
    color: colors.secondary.default,
    fontWeight: "bold",
  },
  info: {
    color: colors.grey[100],
  }

})

const selectStyles = StyleSheet.create({
  dropdownButtonStyle: {
    width: 150,
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: colors.grey[100],
  },
  dropdownButtonArrowStyle: {
    width: 25,
    height: 25
  },
  dropdownButtonIconStyle: {
    width: 25,
    height: 25,
  },
  dropdownMenuStyle: {
    backgroundColor: colors.primary,
    borderColor: colors.grey[100],
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.white,
  },
  dropdownItemTxtStyle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.white,
  },
  dropdownItemIconStyle: {
    width: 25,
    height: 25,
  },
});