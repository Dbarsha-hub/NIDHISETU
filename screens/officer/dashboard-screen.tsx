import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/atoms/app-text';
import { WaveHeader } from '@/components/molecules/wave-header';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useOfficerBeneficiaries } from '@/hooks/use-officer-beneficiaries';
import { useAuthStore } from '@/state/authStore';

export const OfficerDashboardScreen = () => {
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const { analytics, isRefreshing, refresh } = useOfficerBeneficiaries();
  const profile = useAuthStore((state) => state.profile);
  
  const officerName = profile?.name ?? 'Officer';
  const officerId = profile?.id ?? 'OFF-2024-001';
  const designation = (profile as any)?.designation ?? 'District Officer';
  const region = (profile as any)?.region ?? 'Bhopal Division';

  const handleRefresh = async () => {
    await refresh();
  };

  const StatCard = ({ label, value, icon, color, onPress }: any) => (
    <TouchableOpacity 
      style={[styles.statCard, { borderLeftColor: color }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View>
        <AppText style={styles.statValue}>{value}</AppText>
        <AppText style={styles.statLabel}>{label}</AppText>
      </View>
    </TouchableOpacity>
  );

  const ActionCard = ({ title, count, icon, color, onPress, actionLabel = "View All" }: any) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.actionHeader}>
        <View style={[styles.actionIcon, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styles.badge}>
          <AppText style={styles.badgeText}>{count}</AppText>
        </View>
      </View>
      <AppText style={styles.actionTitle}>{title}</AppText>
      <View style={styles.actionFooter}>
        <AppText style={[styles.actionLink, { color }]}>{actionLabel}</AppText>
        <Ionicons name="arrow-forward" size={16} color={color} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <WaveHeader 
        title="Dashboard" 
        rightAction={
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Officer Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={32} color="white" />
            </View>
            <View style={styles.profileInfo}>
              <AppText style={styles.profileName}>{officerName}</AppText>
              <AppText style={styles.profileDesignation}>{designation}</AppText>
            </View>
          </View>
          <View style={styles.profileDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="id-card-outline" size={16} color="#666" />
              <AppText style={styles.detailText}>{officerId}</AppText>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <AppText style={styles.detailText}>{region}</AppText>
            </View>
          </View>
        </View>

        {/* Loan Activity Insights */}
        <AppText style={styles.sectionTitle}>Loan Activity</AppText>
        <View style={styles.statsGrid}>
          <StatCard 
            label="Total Applications" 
            value={analytics.total} 
            icon="documents-outline" 
            color="#2563EB" 
          />
          <StatCard 
            label="Approved" 
            value={analytics.approved} 
            icon="checkmark-circle-outline" 
            color="#16A34A" 
          />
          <StatCard 
            label="In Progress" 
            value={analytics.pending} 
            icon="time-outline" 
            color="#F59E0B" 
          />
          <StatCard 
            label="Rejected" 
            value={analytics.rejected} 
            icon="close-circle-outline" 
            color="#DC2626" 
          />
        </View>

        {/* Beneficiary Management */}
        <AppText style={styles.sectionTitle}>Management</AppText>
        <View style={styles.actionGrid}>
          <ActionCard
            title="Pending Applications"
            count={analytics.pending}
            icon="people-outline"
            color="#F59E0B"
            onPress={() => navigation.navigate('Beneficiaries', { filter: 'pending' })}
          />
          <ActionCard
            title="Verification Tasks"
            count={analytics.pending} // Assuming pending verifications ~ pending apps for now
            icon="shield-checkmark-outline"
            color="#7C3AED"
            actionLabel="Review Now"
            onPress={() => navigation.navigate('VerificationTasks')}
          />
          <ActionCard
            title="Field Visits"
            count={2} // Mock
            icon="calendar-outline"
            color="#0EA5E9"
            actionLabel="View Schedule"
            onPress={() => {}}
          />
          <ActionCard
            title="Reports"
            count="New"
            icon="bar-chart-outline"
            color="#2563EB"
            actionLabel="View Analytics"
            onPress={() => navigation.navigate('Reports')}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingTop: 100, // Space for header
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 60, // Overlap with header
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#008080',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  profileDesignation: {
    fontSize: 14,
    color: '#6B7280',
  },
  profileDetails: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#4B5563',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionGrid: {
    gap: 16,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  actionIcon: {
    padding: 10,
    borderRadius: 12,
  },
  badge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  actionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  actionLink: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 40,
  },
});
