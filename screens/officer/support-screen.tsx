import { AppButton } from '@/components/atoms/app-button';
import { AppIcon } from '@/components/atoms/app-icon';
import { AppText } from '@/components/atoms/app-text';
import { WaveHeader } from '@/components/molecules/wave-header';
import { useAppTheme } from '@/hooks/use-app-theme';
import { ScrollView, StyleSheet, View } from 'react-native';

export const SupportScreen = () => {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <WaveHeader
        title="Help & Support"
        subtitle="We are here to help you"
        height={180}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <AppText variant="titleMedium" color="text" weight="600" style={{ marginBottom: 16 }}>
            Contact Us
          </AppText>
          
          <ContactItem 
            icon="phone" 
            title="Helpline" 
            subtitle="1800-123-4567" 
            action="Call Now" 
          />
          <ContactItem 
            icon="email" 
            title="Email Support" 
            subtitle="support@nidhisetu.gov.in" 
            action="Email" 
          />
          <ContactItem 
            icon="whatsapp" 
            title="WhatsApp" 
            subtitle="+91 98765 43210" 
            action="Chat" 
          />
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <AppText variant="titleMedium" color="text" weight="600" style={{ marginBottom: 16 }}>
            Frequently Asked Questions
          </AppText>
          
          <FAQItem question="How to reset password?" />
          <FAQItem question="How to update beneficiary details?" />
          <FAQItem question="App is not syncing offline data?" />
          <FAQItem question="How to contact supervisor?" />
        </View>

        <View style={styles.footer}>
          <AppButton label="View User Manual" variant="outline" icon="book-open-variant" />
        </View>
      </ScrollView>
    </View>
  );
};

const ContactItem = ({ icon, title, subtitle, action }: { icon: string; title: string; subtitle: string; action: string }) => {
  const theme = useAppTheme();
  return (
    <View style={styles.contactItem}>
      <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryContainer }]}>
        <AppIcon name={icon as any} size={24} color="primary" />
      </View>
      <View style={styles.contactContent}>
        <AppText variant="bodyMedium" color="text" weight="600">
          {title}
        </AppText>
        <AppText variant="bodySmall" color="muted">
          {subtitle}
        </AppText>
      </View>
      <AppButton label={action} variant="ghost" size="small" />
    </View>
  );
};

const FAQItem = ({ question }: { question: string }) => {
  return (
    <View style={styles.faqItem}>
      <AppText variant="bodyMedium" color="text" style={{ flex: 1 }}>
        {question}
      </AppText>
      <AppIcon name="chevron-right" size={20} color="muted" />
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactContent: {
    flex: 1,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  footer: {
    marginTop: 8,
  },
});
