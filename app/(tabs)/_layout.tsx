import { View, Text, Image, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { Tabs } from "expo-router";
import { icons, colors } from "../../constants";
import { Context } from "../../context/GlobalProvider";

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

export default function TabsLayout() {
  const { user } = useContext(Context)!;
  return (
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
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused, color }: IconType) => {
              return <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            }
          }}
        />
        <Tabs.Screen 
          name="bookmark"
          options={{
            title: "Bookmark",
            headerShown: false,
            tabBarIcon: ({ focused, color }: {focused: boolean, color: string }) => {
              return <TabIcon
                icon={icons.bookmark}
                color={color}
                name="Bookmark"
                focused={focused}
              />
            }
          }}
        />
        <Tabs.Screen 
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ focused, color }: {focused: boolean, color: string }) => {
              return <TabIcon
                icon={icons.plus}
                color={color}
                name="Create"
                focused={focused}
              />
            }
          }}
        />
        <Tabs.Screen 
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ focused, color }: {focused: boolean, color: string }) => {
              return <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            }
          }}
        />
      </Tabs>
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