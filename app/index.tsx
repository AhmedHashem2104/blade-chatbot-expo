import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { api_url } from "@/constants/urls";

interface Message {
  message: string;
  id: number | string;
  isUserMessage: boolean;
  source?: string;
  readMore?: boolean;
}
[];

const index = () => {
  const { user, isLoaded } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<any>(null);

  const sendMessage = async () => {
    if (message && !isLoading) {
      setIsLoading(true);
      const newMessage = {
        id: (messages.length + 1).toString(),
        message: message,
        isUserMessage: true,
      };
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      setMessage("");

      try {
        const response = await axios
          .post(`${api_url}/ask`, {
            message: newMessage.message,
          })
          .then((res) => res)
          .catch((err) => {
            console.log(err.response.data);
            return err;
          });

        const aiMessage = {
          id: (messages.length + 2).toString(),
          message: response.data.text,
          source: response.data.sourceDocuments[0].pageContent,
          readMore: false,
          isUserMessage: false,
        };
        setMessages((prevMessages) => [aiMessage, ...prevMessages]);
      } catch (error) {
        console.error("Error fetching AI response:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleReadMore = (id: number | string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, readMore: !msg.readMore } : msg
      )
    );
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0 });
    }
  }, [messages]);

  return (
    isLoaded && (
      <View className="flex-1 bg-gray-100">
        <View className="flex-row px-3 py-2 justify-between items-center shadow-md">
          <View className="flex-row items-center gap-2">
            <Image
              source={{
                uri: user?.imageUrl,
              }}
              resizeMode="cover"
              className="w-10 h-10 rounded-full"
            />
            <Text className="text-lg font-semibold">
              {user?.firstName} {user?.lastName}
            </Text>
          </View>

          <View className="flex-row gap-3 items-center">
            <TouchableOpacity
              onPress={() => {
                setMessages([]);
                setMessage("");
              }}
              disabled={isLoading}
            >
              <Ionicons
                name="reload"
                size={24}
                color="#333"
                style={{
                  opacity: isLoading ? 0.5 : 1,
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.navigate("/settings")}>
              <Ionicons name="settings" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 px-3">
          <FlatList
            ref={flatListRef}
            showsVerticalScrollIndicator={false}
            inverted
            data={messages}
            keyExtractor={(item: any) => item?.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`p-3 rounded-lg my-2 max-w-3/4 ${
                  item?.isUserMessage
                    ? "bg-blue-600 self-end ml-16"
                    : "bg-gray-300 self-start"
                }`}
                onPress={() => toggleReadMore(item.id)}
              >
                <Text
                  className={`text-lg ${
                    item?.isUserMessage ? "text-white" : "text-black"
                  }`}
                >
                  {item?.message}
                </Text>
                {!item.isUserMessage ? (
                  item.readMore ? (
                    <Text className={`text-sm text-slate-700`}>
                      Source: {item?.source}
                    </Text>
                  ) : (
                    <Text className={`text-sm text-blue-700`}>Read more</Text>
                  )
                ) : (
                  <></>
                )}
              </TouchableOpacity>
            )}
          />
          {isLoading && (
            <View className="flex-row items-center justify-center mt-2">
              <ActivityIndicator size="small" color="#007AFF" />
              <Text className="ml-2">Thinking...</Text>
            </View>
          )}
        </View>
        <View className="flex-row items-center p-3 shadow-md">
          <TextInput
            placeholder="Enter your message"
            keyboardType="ascii-capable"
            onChangeText={(value) => setMessage(value)}
            value={message}
            editable={!isLoading} // Disable input while loading
            selectTextOnFocus={!isLoading} // Prevent text selection while loading
            className={`flex-1 border border-gray-300 rounded-full px-4 py-2 text-base ${
              isLoading ? "bg-gray-200" : ""
            }`}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!message || isLoading} // Disable button when no message or loading
            className={`ml-3 mr-1 ${!message || isLoading ? "opacity-50" : ""}`}
          >
            <Ionicons name="send" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    )
  );
};

export default index;
