import { AppButton } from '@/components/atoms/app-button';
import { AppIcon } from '@/components/atoms/app-icon';
import { AppText } from '@/components/atoms/app-text';
import { WaveHeader } from '@/components/molecules/wave-header';
import { useAppTheme } from '@/hooks/use-app-theme';
import { ScrollView, StyleSheet, View } from 'react-native';

export const ReportsScreen = () => {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <WaveHeader
        title="Reports & Analytics"
        subtitle="Performance metrics and summaries"
        height={180}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryRow}>
          <SummaryCard label="Total Applications" value="124" icon="file-document-outline" color="#4F46E5" />
          <SummaryCard label="Approved" value="86" icon="check-circle-outline" color="#10B981" />
        </View>
        <View style={styles.summaryRow}>
          <SummaryCard label="Pending" value="32" icon="clock-outline" color="#F59E0B" />
          <SummaryCard label="Rejected" value="6" icon="close-circle-outline" color="#EF4444" />
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.cardHeader}>
            <AppText variant="titleMedium" color="text" weight="600">
              Monthly Performance
            </AppText>
            <AppButton label="Export" variant="ghost" size="small" icon="download" />
          </View>
          
          <View style={styles.chartPlaceholder}>
            <View style={[styles.bar, { height: '60%', backgroundColor: theme.colors.primary }]} />
            <View style={[styles.bar, { height: '80%', backgroundColor: theme.colors.primary }]} />
            <View style={[styles.bar, { height: '40%', backgroundColor: theme.colors.primary }]} />
            <View style={[styles.bar, { height: '90%', backgroundColor: theme.colors.primary }]} />
            <View style={[styles.bar, { height: '70%', backgroundColor: theme.colors.primary }]} />
            <View style={[styles.bar, { height: '50%', backgroundColor: theme.colors.primary }]} />
          </View>
          <View style={styles.chartLabels}>
            <AppText variant="labelSmall" color="muted">May</AppText>
            <AppText variant="labelSmall" color="muted">Jun</AppText>
            <AppText variant="labelSmall" color="muted">Jul</AppText>
            <AppText variant="labelSmall" color="muted">Aug</AppText>
            <AppText variant="labelSmall" color="muted">Sep</AppText>
            <AppText variant="labelSmall" color="muted">Oct</AppText>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <AppText variant="titleMedium" color="text" weight="600" style={{ marginBottom: 16 }}>
            Recent Activity
          </AppText>
          
          <ActivityItem 
            title="Verification Completed" 
            subtitle="Rahul Kumar - PMEGP" 
            time="2 hours ago" 
            icon="check-circle"
            color="success"
          />
          <ActivityItem 
            title="New Application" 
            subtitle="Sita Devi - Mudra" 
            time="5 hours ago" 
            icon="file-plus"
            color="primary"
          />
          <ActivityItem 
            title="Document Rejected" 
            subtitle="Amit Singh - Missing Invoice" 
            time="1 day ago" 
            icon="alert-circle"
            color="error"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const SummaryCard = ({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) => {
  const theme = useAppTheme();
  return (
    <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.iconBox, { backgroundColor: `${color}20` }]}>
        <AppIcon name={icon as any} size={24} color={color as any} />
      </View>
      <View>
        <AppText variant="headlineSmall" color="text" weight="700">
          {value}
        </AppText>
        <AppText variant="labelSmall" color="muted">
          {label}
        </AppText>
      </View>
    </View>
  );
};

const ActivityItem = ({ title, subtitle, time, icon, color }: { title: string; subtitle: string; time: string; icon: string; color: string }) => {
  const theme = useAppTheme();
  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: theme.colors.surfaceVariant }]}>
        <AppIcon name={icon as any} size={20} color={color as any} />
      </View>
      <View style={styles.activityContent}>
        <AppText variant="bodyMedium" color="text" weight="500">
          {title}
        </AppText>
        <AppText variant="bodySmall" color="muted">
          {subtitle}
        </AppText>
      </View>
      <AppText variant="labelSmall" color="muted">
        {time}
      </AppText>
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
  summaryRow: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 150,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  bar: {
    width: 24,
    borderRadius: 4,
    opacity: 0.8,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
});
