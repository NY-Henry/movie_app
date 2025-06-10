import React from "react";
import { Text, View } from "react-native";

const Index = () => {
  const name = "Henry";

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-3xl text-blue-600 font-bold">Welcome {name}</Text>
    </View>
  );
};

export default Index;
