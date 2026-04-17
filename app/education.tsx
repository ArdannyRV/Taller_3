import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Education } from "../types/cv.types";
import { EPNColors } from "../constants/theme";

interface EducationFormData {
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
}

export default function EducationScreen() {
  const router = useRouter();
  const { cvData, addEducation, deleteEducation } = useCVContext();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EducationFormData>({
    defaultValues: {
      institution: "",
      degree: "",
      field: "",
      graduationYear: "",
    },
  });

  const currentYear = new Date().getFullYear();

  const onSubmit = (data: EducationFormData) => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: data.institution,
      degree: data.degree,
      field: data.field,
      graduationYear: data.graduationYear || "",
    };

    addEducation(newEducation);

    reset({
      institution: "",
      degree: "",
      field: "",
      graduationYear: "",
    });

    Alert.alert("Éxito", "Educación agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta educación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteEducation(id),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Educación</Text>

        <Controller
          control={control}
          rules={{ required: "La institución es requerida" }}
          name="institution"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Institución *"
              placeholder="Nombre de la universidad/institución"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.institution?.message}
            />
          )}
        />

        <Controller
          control={control}
          rules={{ 
            required: "El título es requerido",
            pattern: {
                value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                message: "Este campo solo debe contener letras"
            }
          }}
          name="degree"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Título/Grado *"
              placeholder="Ej: Licenciatura, Maestría"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.degree?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="field"
          rules={{
            pattern: {
                value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                message: "Este campo solo debe contener letras"
            }
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Área de Estudio"
              placeholder="Ej: Ingeniería en Sistemas"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.field?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="graduationYear"
          rules={{
            pattern: {
              value: /^(19|20)\d{2}$/,
              message: "Ingresa un año de 4 dígitos válido",
            },
            validate: (value) => {
              if (!value) return true;
              const year = parseInt(value, 10);
              if (year < 1950 || year > currentYear + 10) {
                return "El año está fuera del rango permitido";
              }
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Año de Graduación"
              placeholder="Ej: 2024"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
              maxLength={4}
              error={errors.graduationYear?.message}
            />
          )}
        />

        <NavigationButton title="Agregar Educación" onPress={handleSubmit(onSubmit)} />

        {cvData.education.length > 0 && (
          <>
            <Text style={styles.listTitle}>Educación Agregada</Text>
            {cvData.education.map((edu) => (
              <View key={edu.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{edu.degree}</Text>
                  <Text style={styles.cardSubtitle}>{edu.field}</Text>
                  <Text style={styles.cardInstitution}>{edu.institution}</Text>
                  <Text style={styles.cardDate}>{edu.graduationYear}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(edu.id)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <NavigationButton
          title="Volver"
          onPress={() => router.back()}
          variant="secondary"
          style={{ marginTop: 16 }}
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
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: EPNColors.secondary,
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: EPNColors.secondary,
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: EPNColors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: EPNColors.secondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: EPNColors.secondary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: EPNColors.textSecondary,
    marginBottom: 4,
  },
  cardInstitution: {
    fontSize: 14,
    color: EPNColors.textSecondary,
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 12,
    color: EPNColors.textSecondary,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: EPNColors.error,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: EPNColors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});