import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Market',
          tabBarIcon: ({ focused }) => <Ionicons name={focused ? 'grid' : 'grid-outline'} size={22} />,
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: 'Sell',
          tabBarIcon: ({ focused }) => <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={22} />,
        }}
      />
      <Tabs.Screen
        name="my-listings"
        options={{
          title: 'My Listings',
          tabBarIcon: ({ focused }) => <Ionicons name={focused ? 'albums' : 'albums-outline'} size={22} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <Ionicons name={focused ? 'person' : 'person-outline'} size={22} />,
        }}
      />

      <Tabs.Screen
  name="favorites"
  options={{
    title: 'Cart',
    tabBarIcon: ({ focused }) => (
      <Ionicons name={focused ? 'cart' : 'cart-outline'} size={22} />
    ),
  }}
/>

    </Tabs>
  );
}
