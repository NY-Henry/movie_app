import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type User = {
  id: number;
  name: string;
  age: number;
};

const UserManager = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState({ name: "", age: 0 });
  const [updating, setUpdating] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const animation = useRef(new Animated.Value(0)).current;
  const nameInputRef = useRef<TextInput>(null);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [users]);

  const handleSaveUpdate = () => {
    if (!user.name.trim() || user.age <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid name and age.");
      return;
    }

    if (updating && editId !== null) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editId ? { ...u, ...user } : u))
      );
    } else {
      setUsers((prev) => [
        ...prev,
        { id: Date.now(), name: user.name.trim(), age: user.age },
      ]);
    }
    setUser({ name: "", age: 0 });
    setUpdating(false);
    setEditId(null);
  };

  const handleEdit = (u: User) => {
    setUser({ name: u.name, age: u.age });
    setEditId(u.id);
    setUpdating(true);
    nameInputRef.current?.focus();
  };

  const handleDelete = (id: number) => {
    Alert.alert("Delete User", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () =>
          setUsers((prev) => prev.filter((user) => user.id !== id)),
        style: "destructive",
      },
    ]);
  };

  const renderItem = ({ item, index }: { item: User; index: number }) => {
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [20 * (index + 1), 0],
    });
    return (
      <Animated.View
        className="bg-white/95 rounded-2xl p-4 mb-4 shadow-lg"
        style={{
          transform: [{ translateY }],
          opacity: animation,
          elevation: 3,
        }}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="bg-blue-100 rounded-full p-2 mr-3">
              <MaterialIcons name="person" size={24} color="#1a73e8" />
            </View>
            <View>
              <Text className="text-lg font-semibold text-gray-800">
                {item.name}
              </Text>
              <Text className="text-sm text-gray-500">Age: {item.age}</Text>
            </View>
          </View>
          <View className="flex-row space-x-10">
            <TouchableOpacity
              onPress={() => handleEdit(item)}
              className="p-2 rounded-full bg-gray-100"
            >
              <MaterialIcons name="edit" size={20} color="#1a73e8" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              className="p-2 rounded-full bg-gray-100"
            >
              <MaterialIcons name="delete" size={20} color="#ea4335" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      className="flex-1 bg-gray-50 px-5 pt-10"
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      <View className="flex-row items-center justify-center mb-6">
        <MaterialIcons name="manage-accounts" size={28} color="#1a73e8" />
        <Text className="text-2xl font-bold text-gray-800 ml-2">
          User Manager
        </Text>
      </View>

      {/* User Form */}
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-md">
        <View className="flex-row items-center border-b border-gray-200 pb-2 mb-4">
          <MaterialIcons
            name="person"
            size={20}
            color="#5f6368"
            className="mr-2"
          />
          <TextInput
            ref={nameInputRef}
            value={user.name}
            placeholder="Name"
            placeholderTextColor="#9aa0a6"
            onChangeText={(name) =>
              setUser((prev: { name: string; age: number }) => ({
                ...prev,
                name,
              }))
            }
            className="text-gray-800 ml-2 flex-1 text-base"
          />
        </View>

        <View className="flex-row items-center border-b border-gray-200 pb-2 mb-4">
          <MaterialIcons
            name="cake"
            size={20}
            color="#5f6368"
            className="mr-2"
          />
          <TextInput
            value={user.age ? user.age.toString() : ""}
            placeholder="Age"
            placeholderTextColor="#9aa0a6"
            keyboardType="number-pad"
            onChangeText={(age) =>
              setUser((prev: { name: string; age: number }) => ({
                ...prev,
                age: parseInt(age) || 0,
              }))
            }
            className="text-gray-800 ml-2 flex-1 text-base"
          />
        </View>

        <TouchableOpacity
          onPress={handleSaveUpdate}
          disabled={!user.name || user.age <= 0}
          className={`mt-2 py-3 rounded-xl flex-row justify-center items-center ${
            updating ? "bg-green-500" : "bg-blue-600"
          } ${!user.name || user.age <= 0 ? "opacity-50" : ""}`}
        >
          <MaterialIcons
            name={updating ? "update" : "add"}
            size={20}
            color="white"
          />
          <Text className="text-white text-center font-semibold text-base ml-2">
            {updating ? "Update User" : "Add User"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* User List */}
      {users.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <MaterialIcons name="people-outline" size={50} color="#9aa0a6" />
          <Text className="text-gray-500 text-lg mt-3">No users yet</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Reset Button */}
      {users.length > 0 && (
        <TouchableOpacity
          onPress={() => setUsers([])}
          className="absolute bottom-8 right-6 bg-red-500 p-4 rounded-full shadow-xl"
          style={{ elevation: 5 }}
        >
          <MaterialIcons name="clear-all" size={24} color="white" />
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

export default UserManager;
