import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/atoms/app-text';
import { Chip } from '@/components/atoms/chip';
import { InputField } from '@/components/atoms/input-field';
import { WaveHeader } from '@/components/molecules/wave-header';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useOfficerBeneficiaries } from '@/hooks/use-officer-beneficiaries';
import type { BeneficiaryLoan } from '@/types/entities';

export const BeneficiaryListScreen = () => {
  const theme = useAppTheme();
  const navigation = useNavigation();
  const { loans, isLoading, isRefreshing, error, refresh } = useOfficerBeneficiaries();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const filterOptions = ['All', 'Pending', 'Approved', 'Rejected', 'High Priority'];

  const filtered = useMemo(() => {
    return loans.filter((item) => {
      const haystack = `${item.name} ${item.loanId} ${item.mobile}`.toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      
      let matchesFilter = true;
      if (filter === 'All') matchesFilter = true;
      else if (filter === 'Pending') matchesFilter = item.status === 'pending';
      else if (filter === 'Approved') matchesFilter = item.status === 'sanctioned' || item.status === 'disbursed';
      else if (filter === 'Rejected') matchesFilter = item.status === 'closed'; // Mapping closed to rejected for demo if needed, or add rejected status
      else if (filter === 'High Priority') matchesFilter = false; // Need priority field in entity

      return matchesQuery && matchesFilter;
    });
  }, [loans, query, filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sanctioned': return '#16A34A';
      case 'disbursed': return '#16A34A';
      case 'pending': return '#F59E0B';
      case 'closed': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const BeneficiaryCard = ({ item }: { item: BeneficiaryLoan }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => {}}>
      <View style={styles.cardHeader}>
        <View>
          <AppText style={styles.cardTitle}>{item.name}</AppText>
          <AppText style={styles.cardSubtitle}>ID: {item.loanId}</AppText>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <AppText style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </AppText>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="cube-outline" size={16} color="#6B7280" />
          <AppText style={styles.infoText}>{item.scheme}</AppText>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={16} color="#6B7280" />
          <AppText style={styles.infoText}>{item.mobile}</AppText>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={16} color="#6B7280" />
          <AppText style={styles.infoText}>₹{item.loanAmount.toLocaleString('en-IN')}</AppText>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.progressContainer}>
          <AppText style={styles.progressLabel}>Completion</AppText>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
        </View>
        <TouchableOpacity style={styles.actionButton}>
          <AppText style={styles.actionButtonText}>Open Case</AppText>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <WaveHeader title="Beneficiaries" onBack={() => navigation.goBack()} />
      
      <View style={styles.contentContainer}>
        <View style={styles.searchContainer}>
          <InputField 
            label="" 
            placeholder="Search by name, ID, or mobile..." 
            onChangeText={setQuery}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.filterContainer}>
          <FlatList
            horizontal
            data={filterOptions}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
            renderItem={({ item }) => (
              <Chip
                label={item}
                tone={filter === item ? 'primary' : 'muted'}
                backgroundColor={filter === item ? undefined : 'white'}
                onPress={() => setFilter(item)}
                style={styles.filterChip}
              />
            )}
          />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
          renderItem={({ item }) => <BeneficiaryCard item={item} />}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator style={styles.loader} color={theme.colors.primary} />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color="#9CA3AF" />
                <AppText style={styles.emptyText}>
                  {error ? 'Unable to load beneficiaries.' : 'No beneficiaries found.'}
                </AppText>
              </View>
            )
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    flex: 1,
    marginTop: 100, // Space for header
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
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
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardBody: {
    gap: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  progressContainer: {
    flex: 1,
    marginRight: 16,
  },
  progressLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  actionButtonText: {
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
