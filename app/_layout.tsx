import { Stack } from "expo-router";
import GlobalProdiver from "../context/GlobalProvider";

export default function RootLayout() {
  return (
    <GlobalProdiver>
      <Stack>
        <Stack.Screen  name="index" options={{headerShown: false}} />
        <Stack.Screen  name="(auth)" options={{headerShown: false}} />
        <Stack.Screen  name="(tabs)" options={{headerShown: false}} />
        {/* <Stack.Screen  name="/search/[query]" options={{headerShown: false}} /> */}
      </Stack>
    </GlobalProdiver>
  );
}
