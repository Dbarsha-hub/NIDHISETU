import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/atoms/app-button';
import { AppText } from '@/components/atoms/app-text';
import { InputField } from '@/components/atoms/input-field';
import { WaveHeader } from '@/components/molecules/wave-header';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useOfficerProfile } from '@/hooks/use-officer-profile';
import { useAuthStore } from '@/state/authStore';

type FormValues = {
  name: string;
  mobile: string;
  designation: string;
};

export const SettingsScreen = () => {
  const theme = useAppTheme();
  const logout = useAuthStore((state) => state.actions.logout);
  const { profile, isLoading, isSaving, error, saveProfile } = useOfficerProfile();

  const { control, handleSubmit, reset, formState } = useForm<FormValues>({
    defaultValues: {
      name: '',
      mobile: '',
      designation: '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({ name: profile.name ?? '', mobile: profile.mobile ?? '', designation: profile.designation ?? '' });
    }
  }, [profile, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await saveProfile(values);
      reset(values);
    } catch (err) {
      // error state already handled inside hook
    }
  });

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <WaveHeader
        title="Settings"
        subtitle="Manage your profile and preferences"
        height={180}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <AppText variant="titleMedium" color="text" weight="600" style={{ marginBottom: 16 }}>
            Profile Details
          </AppText>

          {isLoading ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
            <View style={{ gap: 16 }}>
              <Controller
                control={control}
                name="name"
                rules={{ required: 'Name is required' }}
                render={({ field: { onChange, value }, fieldState }) => (
                  <InputField
                    label="Full Name"
                    placeholder="Officer name"
                    value={value}
                    onChangeText={onChange}
                    errorText={fieldState.error?.message}
                    leftIcon="account"
                  />
                )}
              />
              <Controller
                control={control}
                name="mobile"
                rules={{
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Enter a 10-digit mobile number',
                  },
                }}
                render={({ field: { onChange, value }, fieldState }) => (
                  <InputField
                    label="Phone"
                    placeholder="Contact number"
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={onChange}
                    errorText={fieldState.error?.message}
                    leftIcon="phone"
                  />
                )}
              />
              <Controller
                control={control}
                name="designation"
                rules={{ required: 'Designation is required' }}
                render={({ field: { onChange, value }, fieldState }) => (
                  <InputField
                    label="Designation"
                    placeholder="District Lead"
                    value={value}
                    onChangeText={onChange}
                    errorText={fieldState.error?.message}
                    leftIcon="badge-account"
                  />
                )}
              />
              {error ? (
                <AppText variant="labelSmall" color="error">
                  {error}
                </AppText>
              ) : null}
              <AppButton
                label={isSaving ? 'Saving...' : 'Save Changes'}
                icon="content-save"
                onPress={onSubmit}
                disabled={!formState.isDirty || isSaving}
              />
            </View>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <AppText variant="titleMedium" color="text" weight="600" style={{ marginBottom: 8 }}>
            Session
          </AppText>
          <AppText variant="bodySmall" color="muted" style={{ marginBottom: 16 }}>
            Securely sign out from this device.
          </AppText>
          <AppButton
            label="Logout"
            icon="logout"
            variant="outline"
            onPress={handleLogout}
            style={{ borderColor: theme.colors.error }}
            textStyle={{ color: theme.colors.error }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
