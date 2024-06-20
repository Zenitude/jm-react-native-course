import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, GestureResponderEvent, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, icons } from "../../constants";
import FormField from "../../components/FormField";
import { Video, ResizeMode } from "expo-av";
import { router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import { Context } from "../../context/GlobalProvider";
import { createVideo } from "../../lib/appwrite";
import * as ImagePicker from "expo-image-picker";

export default function Create() {
  const { user } = useContext(Context)!;
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<FormFieldSetter>({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
    userId: user.$id 
  });

  const openPicker = async (selectType: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === "image" ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4,3],
      quality: 1,
    });

    if(!result.canceled) {
      const theform = form as CreateVideoType;
      if(selectType === 'image') {
        setForm({...theform, thumbnail: result.assets[0]})
      }

      if(selectType === 'video') {
        setForm({...theform, video: result.assets[0]})
      }
    }
  }

  const submit = async (e: GestureResponderEvent) => {
    if(!(form as CreateVideoType).prompt || !(form as CreateVideoType).title || !(form as CreateVideoType).thumbnail || !(form as CreateVideoType).video ) {
      Alert.alert('Error Create Video', 'Please fill in all the fields')
    }
    
    setUploading(true);

    try {
      await createVideo(form as CreateVideoType)

      Alert.alert('Success', 'Post uploaded successfully')
      router.push('/home');
    }
    catch(error: any) { Alert.alert('Error Create Video', error.message); } 
    finally { 
      setForm({ title: "", video: null, thumbnail: null, prompt: "", userId: user.$id }); 
      setUploading(false);
    }
  }

  return (
    <SafeAreaView style={styles.area}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.bigTitle}>Upload Video</Text>

        <FormField 
          title={"Video Title"}
          value={(form as CreateVideoType).title}
          placeholder={"Give your video a catch title..."}
          keyboard={"default"}
          setter={setForm}
        />

        <View style={styles.uploadContainer}>
          <Text style={styles.uploadTitle}>Upload Video</Text>
          <TouchableOpacity style={styles.uploadTouch} onPress={() => openPicker('video')}>
            { (form as CreateVideoType).video 
              ? (
                <Video 
                  source={{uri: (form as CreateVideoType).video.uri}}
                  resizeMode={ResizeMode.COVER}
                  style={styles.videoUploaded}
                />
              )
              : (
                <View style={styles.uploadVideoContainer}>
                  <View style={styles.uploadVideo}>
                    <Image 
                      source={icons.upload}
                      resizeMode="contain"
                      style={styles.iconUploadVideo}
                    />
                  </View>
                </View>
              )
            }
          </TouchableOpacity>
        </View>

        <View style={styles.thumbnailContainer}>
          <Text style={styles.thumbnailTitle}>Thumbnail Image</Text>

          <TouchableOpacity style={styles.uploadTouch} onPress={() => openPicker('image')}>
            { (form as CreateVideoType).thumbnail 
              ? (
                <Image 
                  source={{uri:(form as CreateVideoType).thumbnail.uri}}
                  resizeMode={ResizeMode.COVER}
                  style={styles.thumbnail}
                />
              )
              : (
                <View style={styles.insertThumbnailContainer}>
                  <Image 
                    source={icons.upload}
                    resizeMode="contain"
                    style={styles.iconInsertThumbnail}
                  />
                  <Text style={styles.chooseTitle}>Choose a file</Text>
                </View>
              )
            }
          </TouchableOpacity>
        </View>

        <FormField 
          title={"AI prompt"}
          value={(form as CreateVideoType).prompt}
          placeholder={"The prompt you used to create this video"}
          keyboard={"default"}
          setter={setForm}
        />

        <CustomButton 
          title={"Submit & Publish"}
          handlePress={submit}
          styles={styleButton}
          loading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  area: {
    backgroundColor: colors.primary,
    height: "100%",
  },
  scrollContainer: {
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  bigTitle: {
    fontSize: 20,
    color: colors.white,
    fontWeight: "bold",
    marginBottom: 10
  },
  uploadContainer: {
    marginTop: 7,
    gap: 5
  },
  uploadTitle: {
    color: colors.grey[100],
  },
  uploadTouch: {

  },
  videoUploaded: {
    width: "100%",
    height: 125,
    paddingHorizontal: 15,
    backgroundColor: colors.black[100],
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  uploadVideoContainer: {
    width: "100%",
    height: 125,
    paddingHorizontal: 15,
    backgroundColor: colors.black[100],
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  uploadVideo: {
    width: 50,
    height: 50,
    borderColor: colors.secondary.default,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center"
  },
  iconUploadVideo: {
    width: "50%",
    height: "50%"
  },
  thumbnailContainer: {
    marginTop: 10,
    gap: 5
  },
  thumbnailTitle: {
    color: colors.grey[100],
  },
  thumbnail: {
    width: "100%",
    height: 125,
    paddingHorizontal: 15,
    backgroundColor: colors.black[100],
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  }, 
  insertThumbnailContainer: {
    width: "100%",
    height: 35,
    paddingHorizontal: 15,
    backgroundColor: colors.black[100],
    borderColor: colors.black[200],
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    gap: 10
  },
  iconInsertThumbnail : {
    width: 20,
    height: 20
  }, 
  chooseTitle: {
    fontSize: 14,
    color: colors.grey[100]
  }
})

const styleButton = {
  container: {
    marginTop: 20,
    width: "100%",
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary.default,
    borderRadius: 15,
    marginHorizontal: "auto"
  },
  text: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 20
  }
}