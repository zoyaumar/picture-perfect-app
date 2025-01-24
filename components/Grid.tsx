import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { UploadClient, uploadFile } from '@uploadcare/upload-client';
import { getUserId, getUserImages, getUserTasks, updateImages } from '@/hooks/useUserData';
import { ThemedText } from './ThemedText';

const Grid = ({ rows, cols }: { rows: number, cols: number }) => {

  const [id, setId] = useState('hello');
  const [images, setImages] = useState(Array(rows * cols).fill(null));
  const [fetchedTasks, setTasks] = useState(['']);

  useEffect(() => {
    const getid = async () => {
      const userId = await getUserId();
      setId(userId + '')
      const fetchedImages = await getUserImages(userId + '');
      const arr = Array(rows * cols).fill(null)
      for (let i = 0; i < fetchedImages.length && i < arr.length; i++) {
        arr[i] = fetchedImages[i]
      }
      setImages(arr)
      setTasks(await getUserTasks(userId+''))
    };
    getid()
    
  }, [])


  const pickImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      type ReactNativeAsset = {
        uri: string;
        type: string;
        name?: string;
      };
      const assets: ReactNativeAsset = {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName + '',
        type: 'image/jpeg',
      };

      let newImages = [...images];
      uploadFile(assets, { publicKey: 'ad7300aff23461f09657' }).then((file) => {
        newImages[index] = file.cdnUrl + file.name
        newImages = newImages.slice(0, rows * cols)
        setImages(newImages);
        console.log(newImages)
        updateImages(id, newImages)
      })

    }
  };

  const columnWidth = (Dimensions.get('window').width) / cols
  const columnHeight = (Dimensions.get('window').width) / rows

  return (
    <View style={styles.grid}>
      {images.map((image, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.gridItem, { width: columnWidth }, { height: columnHeight }]}
          onPress={() => pickImage(index)}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (

            <View style={styles.placeholder}>
              {fetchedTasks[index] ? (
                <ThemedText type='subtitle' style={styles.text}>{fetchedTasks[index]}</ThemedText>
            ) : (
                <ThemedText type='subtitle' >No task found at this index.</ThemedText>
            )}
            </View>

          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center'
  },
  gridItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: '#eee',
    width: '100%',
    height: '100%',
    
  },
  text:{
    textAlign:'center',
    textAlignVertical:'center',
    flex: 1,
    justifyContent:'center'
  }
});

export default Grid;
