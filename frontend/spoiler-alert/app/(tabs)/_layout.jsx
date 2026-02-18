import { Ionicons } from "@expo/vector-icons"
import { Tabs } from 'expo-router'
import React from 'react'

const TabsLayout = () => {
  return (
    <Tabs
        screenOptions={{
            tabBarActiveTintColor: "green",
            tabBarInactiveTintColor: "red"
        }}
    >
        <Tabs.Screen
            name = "index"
            options = {{
                title: "Home Page",
                tabBarIcon: () => (
                    <Ionicons name="home-outline"/>
                )   
            }}
        />
        <Tabs.Screen
            name = "fridge"
            options = {{
                title: "My Fridge",
                tabBarIcon: () => (
                    <Ionicons name="restaurant-outline"/>
                )   
            }}
        />

        <Tabs.Screen
            name = "recipes"
            options = {{
                title: "My Recipes",
                tabBarIcon: () => (
                    <Ionicons name="heart-circle-outline"/>
                )   
            }}
        />

        <Tabs.Screen
            name = "profile"
            options = {{
                title: "Profile",
                tabBarIcon: () => (
                    <Ionicons name= "person-outline"/>
                )   
            }}
        />

    </Tabs>
  )
}

export default TabsLayout