import { AppIcon } from '@/components/atoms/app-icon';
import { AppText } from '@/components/atoms/app-text';
import { WaveHeader } from '@/components/molecules/wave-header';
import { useAppTheme } from '@/hooks/use-app-theme';
import { FlatList, StyleSheet, View } from 'react-native';

const sample = [
  { id: '1', title: 'New Verification Assigned', body: 'You have been assigned a new PMEGP application for verification.', time: '10 mins ago', type: 'info' },
  { id: '2', title: 'Document Rejected', body: 'Reviewer rejected the asset photo for Application #1234.', time: '2 hours ago', type: 'error' },
  { id: '3', title: 'System Maintenance', body: 'Scheduled maintenance tonight at 12:00 AM.', time: '1 day ago', type: 'warning' },
  { id: '4', title: 'Application Approved', body: 'Application #5678 has been successfully approved.', time: '2 days ago', type: 'success' },
  { id: '5', title: 'Profile Updated', body: 'Your profile details were updated successfully.', time: '3 days ago', type: 'info' },
];

export const NotificationsScreen = () => {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <WaveHeader
        title="Notifications"
        subtitle="Stay updated with latest alerts"
        height={180}
      />

      <FlatList
        contentContainerStyle={styles.listContent}
        data={sample}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: getIconColor(item.type, theme).bg }]}>
                <AppIcon name={getIconName(item.type) as any} size={20} color={getIconColor(item.type, theme).fg as any} />
              </View>
              <View style={styles.content}>
                <View style={styles.headerRow}>
                  <AppText variant="titleSmall" color="text" weight="600" style={{ flex: 1 }}>
                    {item.title}
                  </AppText>
                  <AppText variant="labelSmall" color="muted">
                    {item.time}
                  </AppText>
                </View>
                <AppText variant="bodySmall" color="muted" numberOfLines={2}>
                  {item.body}
                </AppText>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const getIconName = (type: string) => {
  switch (type) {
    case 'error': return 'alert-circle';
    case 'warning': return 'alert-triangle';
    case 'success': return 'check-circle';
    default: return 'bell';
  }
};

const getIconColor = (type: string, theme: any) => {
  switch (type) {
    case 'error': return { bg: '#FEE2E2', fg: '#EF4444' };
    case 'warning': return { bg: '#FEF3C7', fg: '#F59E0B' };
    case 'success': return { bg: '#D1FAE5', fg: '#10B981' };
    default: return { bg: theme.colors.primaryContainer, fg: theme.colors.primary };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});
