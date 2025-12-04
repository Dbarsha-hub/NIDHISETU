import { AppButton } from '@/components/atoms/app-button';
import { AppIcon } from '@/components/atoms/app-icon';
import { AppText } from '@/components/atoms/app-text';
import { WaveHeader } from '@/components/molecules/wave-header';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/state/authStore';
import { ScrollView, StyleSheet, View } from 'react-native';

export const ProfileScreen = () => {
  const theme = useAppTheme();
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <WaveHeader
        title="My Profile"
        subtitle="Manage your account and settings"
        height={200}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primaryContainer }]}>
              <AppText variant="headlineMedium" color="primary">
                {profile?.name?.charAt(0) ?? 'O'}
              </AppText>
            </View>
            <View style={styles.profileInfo}>
              <AppText variant="titleLarge" color="text" weight="600">
                {profile?.name ?? 'Officer Name'}
              </AppText>
              <AppText variant="bodyMedium" color="muted">
                Field Officer • {profile?.region ?? 'Region N/A'}
              </AppText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

          <View style={styles.infoRow}>
            <AppIcon name="phone" size={20} color="muted" />
            <AppText variant="bodyMedium" color="text">
              {profile?.mobile ?? '+91 98765 43210'}
            </AppText>
          </View>
          <View style={styles.infoRow}>
            <AppIcon name="email" size={20} color="muted" />
            <AppText variant="bodyMedium" color="text">
              officer@nidhisetu.gov.in
            </AppText>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <AppText variant="titleMedium" color="text" style={styles.sectionTitle}>
            Account Settings
          </AppText>
          
          <SettingItem icon="bell" label="Notifications" value="On" />
          <SettingItem icon="lock" label="Change Password" />
          <SettingItem icon="translate" label="Language" value="English" />
          <SettingItem icon="help-circle" label="Help & Support" />
        </View>

        <View style={styles.actionContainer}>
          <AppButton
            label="Logout"
            icon="logout"
            variant="outline"
            onPress={handleLogout}
            style={{ borderColor: theme.colors.error }}
            textStyle={{ color: theme.colors.error }}
          />
        </View>
        
        <AppText variant="labelSmall" color="muted" style={styles.version}>
          Version 1.0.0 (Build 2024.10.25)
        </AppText>
      </ScrollView>
    </View>
  );
};

const SettingItem = ({ icon, label, value }: { icon: string; label: string; value?: string }) => {
  const theme = useAppTheme();
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconBox, { backgroundColor: theme.colors.surfaceVariant }]}>
          <AppIcon name={icon as any} size={20} color="primary" />
        </View>
        <AppText variant="bodyMedium" color="text">
          {label}
        </AppText>
      </View>
      {value ? (
        <AppText variant="bodySmall" color="muted">
          {value}
        </AppText>
      ) : (
        <AppIcon name="chevron-right" size={20} color="muted" />
      )}
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
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContainer: {
    marginTop: 8,
  },
  version: {
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.6,
  },
});
