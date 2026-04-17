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
import { DatePickerField } from "../components/DatePickerField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Experience } from "../types/cv.types";
import { EPNColors } from "../constants/theme";

interface ExperienceFormData {
  company: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
}

export default function ExperienceScreen() {
  const router = useRouter();
  const { cvData, addExperience, deleteExperience } = useCVContext();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    defaultValues: {
      company: "",
      position: "",
      startDate: new Date(),
      endDate: null,
      description: "",
    },
  });

  const formatDate = (date: Date): string => {
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const onSubmit = (data: ExperienceFormData) => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: data.company,
      position: data.position,
      startDate: formatDate(data.startDate),
      endDate: data.endDate ? formatDate(data.endDate) : "Actual",
      description: data.description,
    };

    addExperience(newExperience);

    reset({
      company: "",
      position: "",
      startDate: new Date(),
      endDate: null,
      description: "",
    });

    Alert.alert("Éxito", "Experiencia agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta experiencia?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteExperience(id),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Experiencia</Text>

        <Controller
          control={control}
          rules={{ required: "La empresa es requerida" }}
          name="company"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Empresa *"
              placeholder="Nombre de la empresa"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.company?.message}
            />
          )}
        />

        <Controller
          control={control}
          rules={{ 
            required: "El cargo es requerido",
            pattern: {
                value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                message: "Este campo solo debe contener letras"
            }
          }}
          name="position"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Cargo *"
              placeholder="Tu posición"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.position?.message}
            />
          )}
        />

        <Controller
          control={control}
          rules={{ required: "La fecha de inicio es requerida" }}
          name="startDate"
          render={({ field: { onChange, value } }) => (
            <DatePickerField
              label="Fecha de Inicio *"
              value={value}
              onChange={onChange}
              error={errors.startDate?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="endDate"
          rules={{
            validate: (value) => {
              if (!value) return true;
              const startDate = getValues("startDate");
              if (!startDate) return true;
              if (value < startDate) {
                return "La fecha de fin no puede ser anterior a la de inicio";
              }
              return true;
            },
          }}
          render={({ field: { onChange, value } }) => (
            <DatePickerField
              label="Fecha de Fin"
              value={value || undefined}
              onChange={(date) => onChange(date)}
              placeholder="Seleccionar (opcional)"
              error={errors.endDate?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Descripción"
              placeholder="Describe tus responsabilidades y logros..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: "top" }}
            />
          )}
        />

        <NavigationButton title="Agregar Experiencia" onPress={handleSubmit(onSubmit)} />

        {cvData.experiences.length > 0 && (
          <>
            <Text style={styles.listTitle}>Experiencias Agregadas</Text>
            {cvData.experiences.map((exp) => (
              <View key={exp.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{exp.position}</Text>
                  <Text style={styles.cardSubtitle}>{exp.company}</Text>
                  <Text style={styles.cardDate}>
                    {exp.startDate} - {exp.endDate || "Actual"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(exp.id)}
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