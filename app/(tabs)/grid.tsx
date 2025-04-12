import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Download } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';
export default function GridScreen() {
  const [selectedLayout, setSelectedLayout] = useState<'3x4' | '2x3'>('3x4');
  const [image, setImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const params = useLocalSearchParams();
  const viewShotRef = useRef<any>(null);

  useEffect(() => {
    if (params.imageUri) {
      setImage(params.imageUri as string);
    }
  }, [params.imageUri]);

  const saveGridToGallery = async () => {
    try {
      setSaving(true);

      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant permission to save photos to your gallery.'
        );
        return;
      }

      // Capture the grid view
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();

        // Save to gallery
        const asset = await MediaLibrary.createAssetAsync(uri);

        Alert.alert('Success', 'Grid saved to your gallery!', [{ text: 'OK' }]);
      }
    } catch (error) {
      console.error('Error saving grid:', error);
      Alert.alert('Error', 'Failed to save grid. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderGrid = () => {
    const rows = selectedLayout === '3x4' ? 4 : 3;
    const cols = selectedLayout === '3x4' ? 3 : 2;

    return Array(rows)
      .fill(null)
      .map((_, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {Array(cols)
            .fill(null)
            .map((_, colIndex) => (
              <View key={colIndex} style={styles.gridItem}>
                <Image
                  source={{
                    uri:
                      image ||
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop',
                  }}
                  style={styles.gridImage}
                />
              </View>
            ))}
        </View>
      ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Grid Layout</Text>
        <View style={styles.layoutButtons}>
          <TouchableOpacity
            style={[
              styles.layoutButton,
              selectedLayout === '3x4' && styles.layoutButtonActive,
            ]}
            onPress={() => setSelectedLayout('3x4')}
          >
            <Text
              style={[
                styles.layoutButtonText,
                selectedLayout === '3x4' && styles.layoutButtonTextActive,
              ]}
            >
              3 x 4
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.layoutButton,
              selectedLayout === '2x3' && styles.layoutButtonActive,
            ]}
            onPress={() => setSelectedLayout('2x3')}
          >
            <Text
              style={[
                styles.layoutButtonText,
                selectedLayout === '2x3' && styles.layoutButtonTextActive,
              ]}
            >
              2 x 3
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ViewShot
        ref={viewShotRef}
        style={styles.gridContainer}
        options={{ format: 'jpg', quality: 1.0 }}
      >
        <ScrollView style={styles.gridScrollView}>{renderGrid()}</ScrollView>
      </ViewShot>

      <TouchableOpacity
        style={[styles.downloadButton, saving && styles.downloadButtonDisabled]}
        onPress={saveGridToGallery}
        disabled={saving}
      >
        <Download color="#fff" size={24} />
        <Text style={styles.downloadButtonText}>
          {saving ? 'Saving...' : 'Save Grid'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  layoutButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  layoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
  },
  layoutButtonActive: {
    backgroundColor: '#fff',
  },
  layoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  layoutButtonTextActive: {
    color: '#121212',
  },
  gridContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gridScrollView: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gridItem: {
    flex: 1,
    aspectRatio: 3 / 4,
    backgroundColor: '#fff',
    borderRadius: 0,
    borderWidth: 0.5,
    borderColor: '#000',
    marginHorizontal: 5,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  downloadButton: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  downloadButtonDisabled: {
    opacity: 0.7,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
