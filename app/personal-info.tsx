import React from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext"; 
import { PersonalInfo } from "../types/cv.types";
import { EPNColors } from "../constants/theme";


export default function PersonalInfoScreen() {
    const router = useRouter();
    const { cvData, updatePersonalInfo } = useCVContext();

    const { control, handleSubmit, formState: { errors } } = useForm<PersonalInfo>({
        defaultValues: cvData.personalInfo,
    });

    const handleSave = (data: PersonalInfo) => {
        updatePersonalInfo(data);
        Alert.alert("Éxito", "Información guardada correctamente.", [
            { text: "Ok", onPress: () => router.back() },
        ]);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Controller
                    control={control}
                    name="fullName"
                    rules={{ 
                        required: "El nombre es obligatorio",
                        pattern: {
                            value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                            message: "Este campo solo debe contener letras"
                        }
                    }}
                    render={({ field: { onChange, onBlur, value }, fieldState }) => (
                        <InputField
                            label="Nombre Completo"
                            placeholder="Juan Perez"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={fieldState.error?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="email"
                    rules={{ 
                        required: "El email es obligatorio",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Ingresa un email válido"
                        }
                    }}
                    render={({ field: { onChange, onBlur, value }, fieldState }) => (
                        <InputField
                            label="Email"
                            placeholder="juan.perez@example.com"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={fieldState.error?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="phone"
                    rules={{ 
                        pattern: {
                            value: /^[\d\s+]+$/,
                            message: "Formato de teléfono no válido"
                        }
                    }}
                    render={({ field: { onChange, onBlur, value }, fieldState }) => (
                        <InputField
                            label="Teléfono"
                            placeholder="+593 99 999 9999"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="phone-pad"
                            error={fieldState.error?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="location"
                    rules={{}}
                    render={({ field: { onChange, onBlur, value }, fieldState }) => (
                        <InputField
                            label="Ubicación"
                            placeholder="Quito, Ecuador"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={fieldState.error?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="summary"
                    rules={{}}
                    render={({ field: { onChange, onBlur, value }, fieldState }) => (
                        <InputField
                            label="Resumen Profesional"
                            placeholder="Describe brevemente tu perfil laboral..."
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            multiline
                            numberOfLines={4}
                            style={{ height: 100, textAlignVertical: "top" }}
                            error={fieldState.error?.message}
                        />
                    )}
                />
                <NavigationButton
                    title="Guardar Información"
                    onPress={handleSubmit(handleSave)}
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
        backgroundColor: EPNColors.background,
    },
    content: {
        padding: 20,
    }
});