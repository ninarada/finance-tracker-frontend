import { useAuth } from '@/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

const TabsLayout = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return <View className="flex-1 items-center justify-center"><ActivityIndicator /></View>;
  }

  if (!token) {
    return <Redirect href="/onboarding" />;
  }
  
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#5F66F5', 
      headerShown: false, 
      tabBarShowLabel: false, 
      tabBarStyle: {
        paddingTop: 10, 
       
      },
    }}>

      <Tabs.Screen 
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="bar-chart" color={color} />,
        }}
      />

     <Tabs.Screen
        name="scanNew"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 65,
                height: 65,
                borderRadius: 35,
                backgroundColor: '#5F66F5',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20, 
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <FontAwesome size={30} name="plus" color="#fff" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="history" color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
      />

    </Tabs>
  )
}

export default TabsLayout