import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import { icons } from "../../constants";

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
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 84
          }
        }}
      >
        <Tabs.Screen 
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ focused, color }: {focused: boolean, color: string }) => {
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
            title: 'Bookmark',
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
            title: 'Create',
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
            title: 'Profile',
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  tabIcons: {
    width: 20,
    height: 20,
  },
  tabTextUnfocus: {
    color: '#fff',
    fontSize: 10
  },
  tabTextFocused: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15
  }

})