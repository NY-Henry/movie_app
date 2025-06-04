import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
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
        className="bg-gray-800/80 border border-gray-600 rounded-2xl p-4 mb-4"
        style={{
          transform: [{ translateY }],
          opacity: animation,
        }}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-lg font-semibold text-white">
              {item.name}
            </Text>
            <Text className="text-sm text-white/70">Age: {item.age}</Text>
          </View>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={() => handleEdit(item)}
              className="px-3 py-1 rounded-full bg-purple-600"
            >
              <Text className="text-white text-sm">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              className="px-3 py-1 rounded-full bg-red-500"
            >
              <Text className="text-white text-sm">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      className="flex-1 bg-gray-900 px-5 pt-10"
    >
      <Text className="text-3xl font-bold text-white mb-6 text-center">
        User Manager
      </Text>

      {/* User Form */}
      <View className="bg-gray-800/90 rounded-2xl p-6 mb-6 border border-gray-700">
        <TextInput
          ref={nameInputRef}
          value={user.name}
          placeholder="Name"
          placeholderTextColor="#ccc"
          onChangeText={(name) => setUser((prev) => ({ ...prev, name }))}
          className="text-white border-b border-gray-600 pb-2 mb-4 text-base"
        />
        <TextInput
          value={user.age ? user.age.toString() : ""}
          placeholder="Age"
          placeholderTextColor="#ccc"
          keyboardType="number-pad"
          onChangeText={(age) =>
            setUser((prev) => ({ ...prev, age: parseInt(age) || 0 }))
          }
          className="text-white border-b border-gray-600 pb-2 mb-4 text-base"
        />

        <TouchableOpacity
          onPress={handleSaveUpdate}
          disabled={!user.name || user.age <= 0}
          className={`mt-2 py-3 rounded-xl ${
            updating ? "bg-emerald-500" : "bg-blue-600"
          } ${!user.name || user.age <= 0 ? "opacity-50" : ""}`}
        >
          <Text className="text-white text-center font-semibold text-base">
            {updating ? "Update User" : "Add User"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* User List */}
      {users.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white/60 text-lg">No users yet</Text>
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
          className="absolute bottom-8 right-6 bg-red-600 p-4 rounded-full shadow-xl"
        >
          <Text className="text-white font-bold text-sm">Clear</Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

export default UserManager;
