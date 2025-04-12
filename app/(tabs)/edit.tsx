import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Grid, Trash2, Crop } from 'lucide-react-native';
import * as ImageManipulator from 'expo-image-manipulator';

export default function EditScreen() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.imageUri) {
      setImage(params.imageUri as string);
    }
  }, [params.imageUri]);

  const removeBackground = async () => {
    setLoading(true);
    try {
      // Here we would integrate with a background removal API
      // For now, we'll simulate the process with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // After background removal, we would get the processed image URL
      setImage(
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop'
      );
    } catch (error) {
      console.error('Error removing background:', error);
    } finally {
      setLoading(false);
    }
  };

  const cropImage = async () => {
    if (!image) return;

    try {
      setLoading(true);
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        image,
        [
          {
            crop: {
              originX: 0,
              originY: 0,
              width: 1000,
              height: 1333,
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      setImage(manipulatedImage.uri);
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Error cropping image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const changeToGrid = async () => {
    router.push({
      pathname: '/(tabs)/grid',
      params: { imageUri: image },
    } as any);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Processing image...</Text>
        </View>
      ) : (
        <>
          <View style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Text style={styles.placeholder}>No image selected</Text>
            )}
          </View>
          <View style={styles.buttonContainer}>
            {/* <TouchableOpacity
              style={styles.button}
              onPress={removeBackground}
              disabled={!image}
            >
              <Trash2 color="#fff" size={24} />
              <Text style={styles.buttonText}>Remove Background</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.button}
              onPress={changeToGrid}
              disabled={!image}
            >
              <Grid color="#fff" size={24} />
              <Text style={styles.buttonText}>Change to Grid</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    overflow: 'scroll',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  placeholder: {
    color: '#666',
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 16,
  },
});
