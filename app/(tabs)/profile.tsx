import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
  Modal,
  Switch,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  Settings,
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Crown,
  TrendingUp,
  Package,
  X,
  Check,
  Star,
} from "lucide-react-native";
import Colors from "@/constants/colors";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
  isDestructive?: boolean;
}

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  isDestructive = false,
}: MenuItemProps) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemIcon}>{icon}</View>
      <View style={styles.menuItemContent}>
        <Text
          style={[styles.menuItemTitle, isDestructive && styles.destructiveText]}
        >
          {title}
        </Text>
        {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
      </View>
      {showChevron && (
        <ChevronRight size={20} color={Colors.dark.textMuted} />
      )}
    </Pressable>
  );
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    features: ['10 product alerts', 'Basic price tracking', 'Daily updates'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    features: ['Unlimited alerts', 'Real-time tracking', 'Hourly updates', 'Priority support', 'Advanced analytics'],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$29.99',
    period: '/month',
    features: ['Everything in Pro', 'API access', 'Custom integrations', 'Dedicated support', 'Team features'],
  },
];

export default function ProfileScreen() {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('pro');
  
  
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    newDeals: true,
    weeklyReport: false,
    marketingEmails: false,
  });
  
  const [settings, setSettings] = useState({
    darkMode: true,
    autoRefresh: true,
    showProfitPercent: true,
    currency: 'USD',
  });

  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'Profile editing would open here',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK' },
      ]
    );
  };

  const handleSubscription = () => {
    setShowSubscriptionModal(true);
  };

  const handleSelectPlan = (planId: string) => {
    if (planId === currentPlan) {
      Alert.alert('Current Plan', 'You are already subscribed to this plan.');
      return;
    }
    
    Alert.alert(
      'Confirm Subscription',
      `Switch to ${SUBSCRIPTION_PLANS.find(p => p.id === planId)?.name} plan?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            setCurrentPlan(planId);
            setShowSubscriptionModal(false);
            Alert.alert('Success', 'Your subscription has been updated!');
          }
        },
      ]
    );
  };

  const handleNotifications = () => {
    setShowNotificationsModal(true);
  };

  const handleSettings = () => {
    setShowSettingsModal(true);
  };

  const handleHelp = () => {
    Alert.alert(
      'Help & Support',
      'How can we help you?',
      [
        { text: 'FAQs', onPress: () => Alert.alert('FAQs', 'Opening FAQs...') },
        { text: 'Contact Us', onPress: () => Alert.alert('Contact', 'Email: support@arbitrage.pro') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Signed Out', 'You have been successfully signed out.');
          }
        },
      ]
    );
  };

  const renderSubscriptionModal = () => (
    <Modal
      visible={showSubscriptionModal}
      animationType="slide"
      transparent
      onRequestClose={() => setShowSubscriptionModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose Your Plan</Text>
            <Pressable onPress={() => setShowSubscriptionModal(false)} style={styles.closeButton}>
              <X size={24} color={Colors.dark.text} />
            </Pressable>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {SUBSCRIPTION_PLANS.map((plan) => (
              <Pressable
                key={plan.id}
                style={[
                  styles.planCard,
                  currentPlan === plan.id && styles.planCardActive,
                  plan.popular && styles.planCardPopular,
                ]}
                onPress={() => handleSelectPlan(plan.id)}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Star size={12} color={Colors.dark.background} />
                    <Text style={styles.popularText}>Most Popular</Text>
                  </View>
                )}
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  {currentPlan === plan.id && (
                    <View style={styles.currentBadge}>
                      <Check size={12} color={Colors.dark.profit} />
                      <Text style={styles.currentText}>Current</Text>
                    </View>
                  )}
                </View>
                <View style={styles.planPricing}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planPeriod}>{plan.period}</Text>
                </View>
                <View style={styles.planFeatures}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                      <Check size={14} color={Colors.dark.profit} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                <Pressable
                  style={[
                    styles.selectPlanButton,
                    currentPlan === plan.id && styles.selectPlanButtonDisabled,
                  ]}
                  onPress={() => handleSelectPlan(plan.id)}
                >
                  <Text style={[
                    styles.selectPlanText,
                    currentPlan === plan.id && styles.selectPlanTextDisabled,
                  ]}>
                    {currentPlan === plan.id ? 'Current Plan' : 'Select Plan'}
                  </Text>
                </Pressable>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderNotificationsModal = () => (
    <Modal
      visible={showNotificationsModal}
      animationType="slide"
      transparent
      onRequestClose={() => setShowNotificationsModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <Pressable onPress={() => setShowNotificationsModal(false)} style={styles.closeButton}>
              <X size={24} color={Colors.dark.text} />
            </Pressable>
          </View>
          
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingTitle}>Price Alerts</Text>
                <Text style={styles.settingSubtitle}>Get notified when prices change</Text>
              </View>
              <Switch
                value={notifications.priceAlerts}
                onValueChange={(value) => setNotifications(prev => ({ ...prev, priceAlerts: value }))}
                trackColor={{ false: Colors.dark.surfaceLight, true: Colors.dark.profit }}
                thumbColor={Colors.dark.text}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingTitle}>New Deals</Text>
                <Text style={styles.settingSubtitle}>Alert for high-profit opportunities</Text>
              </View>
              <Switch
                value={notifications.newDeals}
                onValueChange={(value) => setNotifications(prev => ({ ...prev, newDeals: value }))}
                trackColor={{ false: Colors.dark.surfaceLight, true: Colors.dark.profit }}
                thumbColor={Colors.dark.text}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingTitle}>Weekly Report</Text>
                <Text style={styles.settingSubtitle}>Summary of your arbitrage activity</Text>
              </View>
              <Switch
                value={notifications.weeklyReport}
                onValueChange={(value) => setNotifications(prev => ({ ...prev, weeklyReport: value }))}
                trackColor={{ false: Colors.dark.surfaceLight, true: Colors.dark.profit }}
                thumbColor={Colors.dark.text}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingTitle}>Marketing Emails</Text>
                <Text style={styles.settingSubtitle}>Tips, news, and promotions</Text>
              </View>
              <Switch
                value={notifications.marketingEmails}
                onValueChange={(value) => setNotifications(prev => ({ ...prev, marketingEmails: value }))}
                trackColor={{ false: Colors.dark.surfaceLight, true: Colors.dark.profit }}
                thumbColor={Colors.dark.text}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderSettingsModal = () => (
    <Modal
      visible={showSettingsModal}
      animationType="slide"
      transparent
      onRequestClose={() => setShowSettingsModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Settings</Text>
            <Pressable onPress={() => setShowSettingsModal(false)} style={styles.closeButton}>
              <X size={24} color={Colors.dark.text} />
            </Pressable>
          </View>
          
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingSubtitle}>Use dark theme</Text>
              </View>
              <Switch
                value={settings.darkMode}
                onValueChange={(value) => setSettings(prev => ({ ...prev, darkMode: value }))}
                trackColor={{ false: Colors.dark.surfaceLight, true: Colors.dark.profit }}
                thumbColor={Colors.dark.text}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingTitle}>Auto Refresh</Text>
                <Text style={styles.settingSubtitle}>Automatically update prices</Text>
              </View>
              <Switch
                value={settings.autoRefresh}
                onValueChange={(value) => setSettings(prev => ({ ...prev, autoRefresh: value }))}
                trackColor={{ false: Colors.dark.surfaceLight, true: Colors.dark.profit }}
                thumbColor={Colors.dark.text}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingTitle}>Show Profit %</Text>
                <Text style={styles.settingSubtitle}>Display profit as percentage</Text>
              </View>
              <Switch
                value={settings.showProfitPercent}
                onValueChange={(value) => setSettings(prev => ({ ...prev, showProfitPercent: value }))}
                trackColor={{ false: Colors.dark.surfaceLight, true: Colors.dark.profit }}
                thumbColor={Colors.dark.text}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" }}
                style={styles.avatar}
              />
              <View style={styles.proBadge}>
                <Crown size={12} color={Colors.dark.background} />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Alex Johnson</Text>
              <Text style={styles.profileEmail}>alex@arbitrage.pro</Text>
              <View style={styles.proPill}>
                <Crown size={12} color={Colors.dark.amazon} />
                <Text style={styles.proText}>PRO Member</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: Colors.dark.profitLight }]}>
                <TrendingUp size={18} color={Colors.dark.profit} />
              </View>
              <Text style={styles.statValue}>$2,847</Text>
              <Text style={styles.statLabel}>Total Profit</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: Colors.dark.amazonLight }]}>
                <Package size={18} color={Colors.dark.amazon} />
              </View>
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>Items Sold</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.menuGroup}>
              <MenuItem
                icon={<User size={20} color={Colors.dark.text} />}
                title="Edit Profile"
                subtitle="Name, email, photo"
                onPress={handleEditProfile}
              />
              <MenuItem
                icon={<CreditCard size={20} color={Colors.dark.text} />}
                title="Subscription"
                subtitle={`${SUBSCRIPTION_PLANS.find(p => p.id === currentPlan)?.name} plan`}
                onPress={handleSubscription}
              />
              <MenuItem
                icon={<Bell size={20} color={Colors.dark.text} />}
                title="Notifications"
                subtitle="Price alerts, new deals"
                onPress={handleNotifications}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.menuGroup}>
              <MenuItem
                icon={<Settings size={20} color={Colors.dark.text} />}
                title="Settings"
                subtitle="App preferences"
                onPress={handleSettings}
              />
              <MenuItem
                icon={<HelpCircle size={20} color={Colors.dark.text} />}
                title="Help & Support"
                subtitle="FAQs, contact us"
                onPress={handleHelp}
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.menuGroup}>
              <MenuItem
                icon={<LogOut size={20} color={Colors.dark.loss} />}
                title="Sign Out"
                showChevron={false}
                isDestructive
                onPress={handleLogout}
              />
            </View>
          </View>

          <Text style={styles.version}>Version 1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
      
      {renderSubscriptionModal()}
      {renderNotificationsModal()}
      {renderSettingsModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.dark.text,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.card,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.dark.surfaceLight,
  },
  proBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.dark.amazon,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.dark.card,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.dark.text,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  proPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.amazonLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 8,
    gap: 4,
  },
  proText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.dark.amazon,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.dark.card,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.dark.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.dark.border,
    marginVertical: 8,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.dark.textSecondary,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuGroup: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.dark.text,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  destructiveText: {
    color: Colors.dark.loss,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: Colors.dark.textMuted,
    marginTop: 32,
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  closeButton: {
    padding: 8,
  },
  planCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  planCardActive: {
    borderColor: Colors.dark.profit,
  },
  planCardPopular: {
    borderColor: Colors.dark.amazon,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.amazon,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
    gap: 4,
  },
  popularText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.dark.background,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.profitLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  currentText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.dark.profit,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  planPeriod: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginLeft: 4,
  },
  planFeatures: {
    marginTop: 16,
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  selectPlanButton: {
    backgroundColor: Colors.dark.profit,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  selectPlanButtonDisabled: {
    backgroundColor: Colors.dark.surfaceLight,
  },
  selectPlanText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.background,
  },
  selectPlanTextDisabled: {
    color: Colors.dark.textSecondary,
  },
  settingsList: {
    gap: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    padding: 16,
    borderRadius: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.dark.text,
  },
  settingSubtitle: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
});
