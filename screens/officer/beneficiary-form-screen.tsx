import { useMemo } from 'react';
import type { Control, RegisterOptions } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/atoms/app-button';
import { AppIcon } from '@/components/atoms/app-icon';
import { InputField, type InputFieldProps } from '@/components/atoms/input-field';
import { FormSectionCard } from '@/components/molecules/form-section-card';
import { BeneficiaryFormHeader } from '@/components/organisms/beneficiary-form-header';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { OfficerStackParamList } from '@/navigation/types';
import { beneficiaryRepository } from '@/services/api/beneficiaryRepository';
import { useAuthStore } from '@/state/authStore';
import type { BeneficiaryFormPayload, BeneficiaryFormValues, BeneficiaryMetadata, OfficerContext } from '@/types/beneficiary';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type BeneficiaryFormScreenProps = NativeStackScreenProps<OfficerStackParamList, 'BeneficiaryForm'>;

const requiredFieldKeys: (keyof BeneficiaryFormValues)[] = [
  'fullName',
  'aadhaar',
  'address',
  'assetName',
  'assetValue',
  'bankName',
  'sanctionAmount',
  'village',
  'mobile',
];

export const BeneficiaryFormScreen = ({ navigation }: BeneficiaryFormScreenProps) => {
  const theme = useAppTheme();
  const profile = useAuthStore((state) => state.profile);
  const officerName = profile?.name ?? 'Field Officer';
  const officerRegion = profile && 'region' in profile ? profile.region : undefined;

  const defaultValues = useMemo<BeneficiaryFormValues>(
    () => ({
      fullName: '',
      aadhaar: '',
      address: '',
      assetName: '',
      assetValue: '',
      bankName: '',
      sanctionAmount: '',
      village: '',
      mobile: '',
      // Default empty values for optional fields to satisfy type requirements if any remain
      guardianName: '',
      dateOfBirth: '',
      gender: '',
      pan: '',
      caste: '',
      maritalStatus: '',
      beneficiaryPhoto: '',
      alternateNumber: '',
      email: '',
      state: '',
      district: '',
      block: '',
      pin: '',
      geoLocation: '',
      loanId: '',
      schemeName: '',
      loanType: '',
      branchName: '',
      ifsc: '',
      disbursedAmount: '',
      sanctionDate: '',
      disbursementDate: '',
      emiStartDate: '',
      emiAmount: '',
      loanPurpose: '',
      businessName: '',
      businessType: '',
      invoiceUpload: '',
      businessAddress: '',
      businessGeoLocation: '',
      licenseNumber: '',
      requiredPhotos: [],
      requiredVideos: [],
      requiredDocuments: [],
      deadline: '',
      assignedOfficer: officerName,
      priorityLevel: 'Normal',
      notes: '',
      tags: [],
    }),
    [officerName]
  );

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BeneficiaryFormValues>({ defaultValues, mode: 'onBlur' });

  const metadataSeed = useMemo(
    () => ({
      beneficiaryUid: `BEN-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: 'Active',
    }),
    []
  );

  const values = watch();
  const completionPercent = useMemo(() => {
    const filled = requiredFieldKeys.filter((key) => {
      const value = values[key];
      return Boolean(value && value.toString().trim().length);
    }).length;
    return Math.round((filled / requiredFieldKeys.length) * 100);
  }, [values]);

  const officerContext = useMemo<OfficerContext>(
    () => ({
      id: profile?.id,
      name: officerName,
      mobile: profile?.mobile,
      region: officerRegion,
    }),
    [profile, officerName, officerRegion]
  );

  const metadata: BeneficiaryMetadata = {
    ...metadataSeed,
    updatedAt: new Date().toISOString(),
    docCount: 0,
    completionPercent,
    createdBy: officerContext,
  };

  const onSubmit = handleSubmit(async (formValues) => {
    const payload: BeneficiaryFormPayload = {
      ...formValues,
      sanctionAmount: Number(formValues.sanctionAmount || 0),
      assetValue: Number(formValues.assetValue || 0),
      // Ensure other numeric fields are 0 if not present
      disbursedAmount: 0,
      emiAmount: 0,
    };

    try {
      const record = await beneficiaryRepository.saveDraft(payload, metadata);
      Alert.alert('Beneficiary saved', `UID ${record.metadata.beneficiaryUid}`, [
        { text: 'Continue editing' },
        {
          text: 'Save & Close',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save beneficiary right now. Please retry.';
      Alert.alert('Save failed', message);
    }
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <BeneficiaryFormHeader onBack={() => navigation.goBack()} completionPercent={completionPercent} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FormSectionCard
          title="Beneficiary Details"
          subtitle="Basic information"
          icon={<AppIcon name="account" size={24} color="primary" />}
        >
          <ControlledInput
            control={control}
            name="fullName"
            label="Full Name"
            placeholder="Applicant name"
            rules={{ required: 'Full name is required' }}
            errorText={errors.fullName?.message}
          />
          <ControlledInput
            control={control}
            name="mobile"
            label="Mobile Number"
            keyboardType="number-pad"
            placeholder="10 digit mobile number"
            rules={{
              required: 'Mobile number required',
              pattern: { value: /^\d{10}$/, message: 'Enter 10 digit mobile number' },
            }}
            errorText={errors.mobile?.message}
          />
          <ControlledInput
            control={control}
            name="aadhaar"
            label="Aadhaar Number"
            placeholder="12 digit Aadhaar"
            keyboardType="number-pad"
            rules={{
              required: 'Enter Aadhaar number',
              pattern: { value: /^\d{12}$/, message: 'Enter 12 digit Aadhaar' },
            }}
            errorText={errors.aadhaar?.message}
          />
          <ControlledInput
            control={control}
            name="address"
            label="Address"
            placeholder="Full address"
            rules={{ required: 'Address is required' }}
            errorText={errors.address?.message}
          />
          <ControlledInput
            control={control}
            name="village"
            label="Village"
            placeholder="Village name"
            rules={{ required: 'Village is required' }}
            errorText={errors.village?.message}
          />
        </FormSectionCard>

        <FormSectionCard
          title="Asset & Loan Details"
          subtitle="Financial information"
          icon={<AppIcon name="cash" size={24} color="primary" />}
        >
          <ControlledInput
            control={control}
            name="assetName"
            label="Asset Name"
            placeholder="e.g. Tractor, Shop, etc."
            rules={{ required: 'Asset name required' }}
            errorText={errors.assetName?.message}
          />
          <ControlledInput
            control={control}
            name="assetValue"
            label="Asset Value"
            keyboardType="numeric"
            placeholder="₹"
            rules={{ required: 'Asset value required' }}
            errorText={errors.assetValue?.message}
          />
          <ControlledInput
            control={control}
            name="bankName"
            label="Bank Name"
            placeholder="Bank name"
            rules={{ required: 'Bank is required' }}
            errorText={errors.bankName?.message}
          />
          <ControlledInput
            control={control}
            name="sanctionAmount"
            label="Sanction Amount"
            keyboardType="numeric"
            placeholder="₹"
            rules={{ required: 'Sanction amount required' }}
            errorText={errors.sanctionAmount?.message}
          />
        </FormSectionCard>

        <View style={styles.footer}>
          <AppButton
            label={isSubmitting ? 'Saving...' : 'Save Beneficiary'}
            onPress={onSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>
    </View>
  );
};

// Helper components
const ControlledInput = ({
  control,
  name,
  rules,
  errorText,
  ...props
}: InputFieldProps & { control: Control<any>; name: string; rules?: RegisterOptions }) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <InputField
          {...props}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          errorText={errorText}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  footer: {
    padding: 16,
  },
});
