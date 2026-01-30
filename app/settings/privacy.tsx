import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/constants/theme';

export default function Privacy() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Last Updated */}
        <Text style={styles.lastUpdated}>Last updated: January 30, 2024</Text>

        {/* Quick Links */}
        <View style={styles.quickLinks}>
          <TouchableOpacity style={styles.quickLink}>
            <Ionicons name="download-outline" size={20} color={colors.accent.primary} />
            <Text style={styles.quickLinkText}>Download My Data</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLink}>
            <Ionicons name="trash-outline" size={20} color={colors.error.primary} />
            <Text style={[styles.quickLinkText, { color: colors.error.primary }]}>Delete My Data</Text>
          </TouchableOpacity>
        </View>

        {/* Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            We collect information you provide directly to us, such as when you create an account,
            log workouts, track nutrition, or contact us for support.
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bullet}>• Account information (email, name, profile photo)</Text>
            <Text style={styles.bullet}>• Fitness data (workouts, exercises, body measurements)</Text>
            <Text style={styles.bullet}>• Nutrition data (food logs, macros, calories)</Text>
            <Text style={styles.bullet}>• Device information (device type, OS version)</Text>
            <Text style={styles.bullet}>• Usage data (app interactions, feature usage)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the information we collect to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bullet}>• Provide and improve our services</Text>
            <Text style={styles.bullet}>• Personalize your experience</Text>
            <Text style={styles.bullet}>• Send you notifications and updates</Text>
            <Text style={styles.bullet}>• Analyze usage patterns to improve the app</Text>
            <Text style={styles.bullet}>• Respond to your requests and support needs</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Data Sharing</Text>
          <Text style={styles.paragraph}>
            We do not sell your personal information. We may share your information with:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bullet}>• Service providers who assist in app operations</Text>
            <Text style={styles.bullet}>• Analytics partners (in aggregated, anonymous form)</Text>
            <Text style={styles.bullet}>• Law enforcement when required by law</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement industry-standard security measures to protect your data, including
            encryption in transit and at rest, secure authentication, and regular security audits.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.paragraph}>
            You have the right to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bullet}>• Access your personal data</Text>
            <Text style={styles.bullet}>• Correct inaccurate data</Text>
            <Text style={styles.bullet}>• Delete your account and data</Text>
            <Text style={styles.bullet}>• Export your data in a portable format</Text>
            <Text style={styles.bullet}>• Opt out of marketing communications</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Third-Party Integrations</Text>
          <Text style={styles.paragraph}>
            When you connect third-party services (Apple Health, Garmin, etc.), we only access
            data necessary to provide the integration. Each service has its own privacy policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Our service is not intended for users under 13 years of age. We do not knowingly
            collect information from children under 13.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this policy from time to time. We will notify you of any material
            changes by email or through the app.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have questions about this privacy policy, please contact us at:
          </Text>
          <TouchableOpacity style={styles.contactCard}>
            <Ionicons name="mail" size={20} color={colors.accent.primary} />
            <Text style={styles.contactText}>privacy@lucasgym.app</Text>
          </TouchableOpacity>
        </View>

        {/* Related Links */}
        <View style={styles.relatedLinks}>
          <TouchableOpacity style={styles.relatedLink}>
            <Text style={styles.relatedLinkText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.relatedLink}>
            <Text style={styles.relatedLinkText}>Cookie Policy</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.relatedLink}>
            <Text style={styles.relatedLinkText}>GDPR Compliance</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  lastUpdated: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.lg,
  },
  quickLinks: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  quickLink: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  quickLinkText: {
    fontSize: fontSize.sm,
    color: colors.accent.primary,
    fontWeight: fontWeight.medium,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  paragraph: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  bulletList: {
    gap: spacing.sm,
  },
  bullet: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 24,
    paddingLeft: spacing.sm,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginTop: spacing.md,
    ...shadows.sm,
  },
  contactText: {
    fontSize: fontSize.md,
    color: colors.accent.primary,
  },
  relatedLinks: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xxl,
    ...shadows.sm,
  },
  relatedLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  relatedLinkText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
});
