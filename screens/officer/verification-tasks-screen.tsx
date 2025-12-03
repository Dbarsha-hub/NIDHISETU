import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/atoms/app-text';
import { WaveHeader } from '@/components/molecules/wave-header';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useOfficerBeneficiaries } from '@/hooks/use-officer-beneficiaries';

export const VerificationTasksScreen = () => {
  const theme = useAppTheme();
  const navigation = useNavigation();
  const { records, isLoading, isRefreshing, refresh } = useOfficerBeneficiaries();

  const tasks = useMemo(() => {
    return records
      .filter((record) => (record.metadata?.status ?? '').toLowerCase() !== 'approved')
      .map((record) => ({
        id: record.id,
        name: record.fullName,
        priority: record.priorityLevel ?? 'Normal',
        status: record.metadata?.status ?? 'Pending',
        updatedAt: record.metadata?.updatedAt,
        village: record.village,
        docCount: record.metadata?.docCount ?? 0,
      }));
  }, [records]);

  const TaskCard = ({ item }: { item: (typeof tasks)[number] }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => {}}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarPlaceholder}>
            <AppText style={styles.avatarText}>{item.name.charAt(0)}</AppText>
          </View>
          <View>
            <AppText style={styles.cardTitle}>{item.name}</AppText>
            <AppText style={styles.cardSubtitle}>{item.village || 'Unknown Location'}</AppText>
          </View>
        </View>
        <View style={[styles.priorityBadge, item.priority === 'High' ? styles.highPriority : styles.normalPriority]}>
          <AppText style={[styles.priorityText, item.priority === 'High' ? styles.highPriorityText : styles.normalPriorityText]}>
            {item.priority}
          </AppText>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoItem}>
          <Ionicons name="document-text-outline" size={16} color="#6B7280" />
          <AppText style={styles.infoText}>{item.docCount} Documents</AppText>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <AppText style={styles.infoText}>{formatTimestamp(item.updatedAt)}</AppText>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.reviewButton}>
          <AppText style={styles.reviewButtonText}>Review Now</AppText>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <WaveHeader title="Verification Tasks" onBack={() => navigation.goBack()} />
      
      <View style={styles.contentContainer}>
        <FlatList
          contentContainerStyle={styles.listContent}
          data={tasks}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => <TaskCard item={item} />}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator style={styles.loader} color={theme.colors.primary} />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle-outline" size={48} color="#10B981" />
                <AppText style={styles.emptyText}>
                  {tasks.length ? null : 'All caught up! No pending tasks.'}
                </AppText>
              </View>
            )
          }
        />
      </View>
    </View>
  );
};

const formatTimestamp = (value?: string) => {
  if (!value) {
    return 'Just now';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    flex: 1,
    marginTop: 100,
  },
  listContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#008080',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  highPriority: {
    backgroundColor: '#FEE2E2',
  },
  normalPriority: {
    backgroundColor: '#F3F4F6',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  highPriorityText: {
    color: '#DC2626',
  },
  normalPriorityText: {
    color: '#4B5563',
  },
  cardBody: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#4B5563',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  loader: {
    marginTop: 40,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
    gap: 12,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
  },
});
