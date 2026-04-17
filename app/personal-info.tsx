import React, {useState, useEffect} from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext"; 
import { PersonalInfo } from "../types/cv.types";


export default function PersonalInfoScreen() {
    const router = useRouter();
    const { cvData, updatePersonalInfo } = useCVContext();
    const [fromData, setFromData] = useState<PersonalInfo>(cvData.personalInfo);

    useEffect(() => {
        setFromData(cvData.personalInfo);
    }, [cvData.personalInfo]);

    const handleSave = () => {
        if (!fromData.fullName || !fromData.email) {
            Alert.alert("Error", "Por favor completa al menos el nombre e email.");
            return;
        }
        updatePersonalInfo(fromData);
        Alert.alert("Éxito", "Información guardada correctamente.",[
            { text: "Ok", onPress: () => router.back },
        ]);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <InputField
                    label="Nombre Completo"
                    placeholder="Juan Perez"
                    value={fromData.fullName}
                    onChangeText={(text) => setFromData({...fromData, fullName: text})}
                />
                <InputField
                    label="Email"
                    placeholder="juan.perez@example.com"
                    value={fromData.email}
                    onChangeText={(text) => setFromData({...fromData, email: text})}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <InputField
                    label="Teléfono"
                    placeholder="+593 99 999 9999"
                    value={fromData.phone}
                    onChangeText={(text) => setFromData({...fromData, phone: text})}
                    keyboardType="phone-pad"
                />
                <InputField
                    label="Ubicación"
                    placeholder="Quito, Ecuador"
                    value={fromData.location}
                    onChangeText={(text) => setFromData({...fromData, location: text})}
                />
                <InputField
                    label="Resumen Profesional"
                    placeholder="Describe brevemente tu perfil laboral..."
                    value={fromData.summary}
                    onChangeText={(text) => setFromData({...fromData, summary: text})}
                    multiline
                    numberOfLines={4}
                    style={{ height: 100, textAlignVertical: "top" }}
                />
                <NavigationButton
                    title="Guardar Información"
                    onPress={handleSave}
                />
                <NavigationButton
                    title="Cancelar"
                    onPress={() => router.back()}
                    variant="secondary"
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    content: {
        padding: 20,
    }
});






