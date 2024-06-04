import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images, colors } from "../constants";
import CustomButton from "../components/CustomButton";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ height: '100%', justifyContent: 'center' }}>
        <View style={styles.imagesContainer}>
          <Image source={images.logo} resizeMode="contain" style={styles.logo}/>
          <Image source={images.cards} style={styles.cards}/>

          <View style={styles.inView}>
            <Text style={styles.slogan}>
              Discover Endless Possibilities with{' '}
              <Text style={styles.textLogo}>Aora</Text>
            </Text>
            <Image source={images.path} resizeMode="contain" style={styles.inImage}/>
          </View>

          <Text style={styles.description}>Where creativity meets innovation: embark on a journey of limitless exploration with Aora</Text>

          <CustomButton 
            title={"Continue with Email"} 
            handlePress={() => router.push('/signin')}
            styles={styleButton}
          />
        </View>
        
      </ScrollView>
      <StatusBar backgroundColor={colors.primary} style="light"/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagesContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5
  },
  logo: {
    width: 130,
    height: 84
  },
  cards: {
    maxWidth: 380,
    height: 300
  },
  inView: {
    position: 'relative',
    marginTop: 10
  },
  slogan: {
    fontSize: 35,
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  textLogo: {
    color: colors.secondary[200]
  },
  inImage: {
    width: 136,
    height: 15,
    position: 'absolute',
    bottom: -9,
    right: -35 
  },
  description: {
    color: colors.grey[100],
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14
  },  
})

const styleButton = {
  container: {
    marginTop: 20,
    minWidth: 280,
    maxWidth: 305,
    minHeight: 62,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary.default,
    borderRadius: 50
  },
  text: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 20
  }
}