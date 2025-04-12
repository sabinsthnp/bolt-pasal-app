import { Tabs } from 'expo-router';
import { Image, Upload, Grid2x2 as Grid } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      {/* <Tabs.Screen
        name="index"
        options={{
          title: 'Upload',
          tabBarIcon: ({ size, color }) => <Upload size={size} color={color} />,
        }}
      /> */}
      {/* <Tabs.Screen
        name="edit"
        options={{
          title: 'Edit',
          tabBarIcon: ({ size, color }) => <Image size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="grid"
        options={{
          title: 'Grid',
          tabBarIcon: ({ size, color }) => <Grid size={size} color={color} />,
        }}
      /> */}
    </Tabs>
  );
}
