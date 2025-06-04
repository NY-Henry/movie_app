import Users from "@/components/Users";
import React, { useState } from "react";
import { View } from "react-native";

const Index = () => {
  const [color, setColor] = useState("");

  const colors = ["red", "green", "orange", "blue", "cyan"];

  return (
    <View style={{ flex: 1, backgroundColor: color }}>
      <Users />
    </View>
  );
};

export default Index;
