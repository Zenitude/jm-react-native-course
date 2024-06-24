import { View, Image, Text, StyleSheet } from "react-native";
import React from "react";
import { Tabs } from "expo-router"
import { StatusBar } from "expo-status-bar";
import { colors, icons } from "../../constants"

const TabIcon = ({icon, color, name, focused}: TabIconType) => {
    return (
      <View style={styles.tabView}>
        <Image
          style={styles.tabIcons}
          source={icon}
          resizeMode="contain"
          tintColor={color}
        />
        <Text style={focused ? styles.tabTextFocused : styles.tabTextUnfocus }>{name}</Text>
      </View>
    )
  }

export default function AdminLayout() {
  return (
    <>
      <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.activeTab,
          tabBarInactiveTintColor: colors.grey[100],
          tabBarStyle: {
            backgroundColor: colors.primary,
            borderTopWidth: 1,
            borderTopColor: colors.black[200],
            height: 84
          }
        }}
      >
        <Tabs.Screen 
          name="dashboard"
          options={{
            title: "Dashboard",
            headerShown: false,
            tabBarIcon: ({ focused, color }: IconType) => {
              return <TabIcon
                icon={icons.dashboard}
                color={color}
                name="Dashboard"
                focused={focused}
              />
            }
          }}
        />
        <Tabs.Screen 
          name="users"
          options={{
            title: "Users",
            headerShown: false,
            tabBarIcon: ({ focused, color }: {focused: boolean, color: string }) => {
              return <TabIcon
                icon={icons.profile}
                color={color}
                name="Users"
                focused={focused}
              />
            }
          }}
        />
        <Tabs.Screen 
          name="posts"
          options={{
            title: "Posts",
            headerShown: false,
            tabBarIcon: ({ focused, color }: {focused: boolean, color: string }) => {
              return <TabIcon
                icon={icons.bookmark}
                color={color}
                name="Posts"
                focused={focused}
              />
            }
          }}
        />
        <Tabs.Screen 
          name="storage"
          options={{
            title: "Storage",
            headerShown: false,
            tabBarIcon: ({ focused, color }: {focused: boolean, color: string }) => {
              return <TabIcon
                icon={icons.basket}
                color={color}
                name="Storage"
                focused={focused}
              />
            }
          }}
        />
      </Tabs>
    </>
      <StatusBar backgroundColor={colors.primary} style="light"/>
    </>
  )
}

const styles = StyleSheet.create({
    tabView: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 5
    },
    tabIcons: {
      width: 20,
      height: 20,
    },
    tabTextUnfocus: {
      color: "#fff",
      fontSize: 10
    },
    tabTextFocused: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 15
    }
  
  })