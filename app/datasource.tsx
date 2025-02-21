import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { api_url } from "@/constants/urls";

const AddTextSource = ({ onSubmit, loading }: any) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text) {
      onSubmit({ type: "text", data: text });
      setText("");
    } else {
      Alert.alert("Error", "Please enter some text.");
    }
  };

  return (
    <View className="flex-1 px-4 py-2">
      <TextInput
        placeholder="Enter your text here"
        value={text}
        onChangeText={setText}
        className="border border-gray-300 rounded-lg py-1 px-3 mb-4 bg-white"
        multiline
        numberOfLines={6}
      />
      <TouchableOpacity
        className="bg-blue-600 p-3 rounded-lg items-center"
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}>
            Submit
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const AddFileSource = ({ onSubmit }: any) => {
  const handlePickDocument = async () => {
    let result: any = await DocumentPicker.getDocumentAsync({
      type: [
        "text/plain",
        "application/pdf",
        "text/csv",
        "application/json",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    });
    console.log(result);
    if (result.assets[0].size < 1000000) {
      onSubmit({
        type: "file",
        data: result.assets[0].uri,
        fileType: result.assets[0].mimeType,
      });
    } else {
      console.log(`Over size with ${result.assets[0].size}`);
    }
  };

  return (
    <View className="flex-1 px-4 py-2 justify-center items-center">
      <TouchableOpacity
        className="bg-blue-600 p-3 rounded-lg items-center"
        onPress={handlePickDocument}
      >
        <Text className="text-white font-bold">Pick a file</Text>
      </TouchableOpacity>
    </View>
  );
};

const AddDataSource = () => {
  const [selectedTab, setSelectedTab] = useState("text");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (source: any) => {
    console.log(source, "source");
    if (!loading) {
      setLoading(true);
      try {
        if (source.type === "file") {
          const formData: any = new FormData();
          formData.append("file", {
            uri: source.data,
            name: `upload.${source.fileType.split("/")[1]}`,
            type: source.fileType,
          });

          formData.append("type", "file");

          formData.append("fileType", source.fileType);

          await axios
            .post(`${api_url}/addSource`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .catch(() => {});
        } else {
          await axios
            .post(`${api_url}/addSource`, {
              content: source.data,
              type: source.type,
            })
            .catch(() => {});
        }
        console.log("Submitted Data Source:", source);
        Alert.alert("Success", "Data source submitted successfully!");
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Error", "Failed to submit data source.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-row px-3 py-2 justify-between items-center shadow-md">
        <Text className="text-lg font-semibold">Add Data Source</Text>
      </View>
      <View className="flex-row justify-center p-2">
        <TouchableOpacity
          className={`flex-row w-24 justify-center items-center py-2 rounded-full ${
            selectedTab === "text" ? "bg-blue-600" : "bg-gray-300"
          }`}
          onPress={() => setSelectedTab("text")}
        >
          <Text
            className={`text-base ${
              selectedTab === "text" ? "text-white" : "text-black"
            }`}
          >
            Text
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-row w-24 justify-center items-center py-2 rounded-full ml-2 ${
            selectedTab === "file" ? "bg-blue-600" : "bg-gray-300"
          }`}
          onPress={() => setSelectedTab("file")}
        >
          <Text
            className={`text-base ${
              selectedTab === "file" ? "text-white" : "text-black"
            }`}
          >
            File
          </Text>
        </TouchableOpacity>
      </View>
      {selectedTab === "text" ? (
        <AddTextSource onSubmit={handleSubmit} loading={loading} />
      ) : (
        <AddFileSource onSubmit={handleSubmit} />
      )}
    </View>
  );
};

export default AddDataSource;
