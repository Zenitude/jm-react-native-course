import { View, Text } from "react-native"
import React from "react"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar";
import { colors } from "../../constants"

export default function AuthLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen 
          name="signin" 
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="signup"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar backgroundColor={colors.primary} style="light"/>
    </>
  )
}