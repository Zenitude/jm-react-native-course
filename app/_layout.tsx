import { Stack } from "expo-router";
import React from "react";
import GlobalProvider from "../context/GlobalProvider";

export default function RootLayout() {
  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen  name="index" options={{headerShown: false}} />
        <Stack.Screen  name="(auth)" options={{headerShown: false}} />
        <Stack.Screen  name="(tabs)" options={{headerShown: false}} />
        <Stack.Screen  name="(admin)" options={{headerShown: false}} />
        <Stack.Screen  name="search/[query]" options={{headerShown: false}} />
        <Stack.Screen  name="files/[id]" options={{headerShown: false}} />
        <Stack.Screen  name="posts/[id]" options={{headerShown: false}} />
        <Stack.Screen  name="users/[id]" options={{headerShown: false}} />
        <Stack.Screen  name="users/account/[id]" options={{headerShown: false}} />
        <Stack.Screen  name="users/delete/[id]" options={{headerShown: false}} />
        <Stack.Screen  name="users/create" options={{headerShown: false}} />
      </Stack>
    </GlobalProvider>
  );
}
