import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const COLORS = {
  primary: '#ea580c',
  secondary: '#fb923c',
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray400: '#9ca3af',
  gray600: '#4b5563',
  gray900: '#111827',
  blue50: '#eff6ff',
  blue600: '#2563eb',
  green50: '#f0fdf4',
  green600: '#16a34a',
  orange50: '#fff7ed',
  orange600: '#ea580c',
  amber50: '#fffbeb',
  amber600: '#d97706',
  red50: '#fef2f2',
  red600: '#dc2626',
};

interface ScannedReceipt {
  id: string;
  amount: number;
  merchant: string;
  category: string;
  date: string;
  items: string[];
  confidence: number;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  time: string;
  source: 'manual' | 'scanned';
}

export default function BudgetScreen() {
  // State for receipt scanning
  const [showCamera, setShowCamera] = useState(false);
  const [scannedReceipt, setScannedReceipt] = useState<ScannedReceipt | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', description: 'Hotel Le Marais', amount: 120, category: 'Accommodation', date: 'Dec 16', time: '2:30 PM', source: 'manual' },
    { id: '2', description: 'Café de Flore', amount: 28, category: 'Food', date: 'Dec 16', time: '10:45 AM', source: 'manual' },
    { id: '3', description: 'Metro Day Pass', amount: 15, category: 'Transportation', date: 'Dec 15', time: '8:20 AM', source: 'manual' }
  ]);

  const [currentTrip, setCurrentTrip] = useState({
    budget: 2500,
    spent: 450,
  });

  const budgetCategories = [
    { category: 'Accommodation', amount: 180, budget: 800, icon: 'home', color: COLORS.blue600 },
    { category: 'Food & Dining', amount: 150, budget: 600, icon: 'restaurant', color: COLORS.orange600 },
    { category: 'Transportation', amount: 80, budget: 400, icon: 'directions-car', color: COLORS.green600 },
    { category: 'Activities', amount: 40, budget: 500, icon: 'camera-alt', color: COLORS.amber600 }
  ];

  // AI Receipt Scanning Functions
  const handleScanReceipt = () => {
    setShowCamera(true);
    // Simulate camera opening and receipt capture
    simulateReceiptCapture();
  };

  const simulateReceiptCapture = () => {
    setIsScanning(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const mockScannedReceipt: ScannedReceipt = {
        id: Date.now().toString(),
        amount: 42.50,
        merchant: "Le Petit Bistro",
        category: "Food & Dining",
        date: new Date().toLocaleDateString(),
        items: ["Coq au Vin - €28.00", "Glass of Wine - €8.50", "Service Charge - €6.00"],
        confidence: 94
      };
      
      setScannedReceipt(mockScannedReceipt);
      setIsScanning(false);
      setShowCamera(false);
      setShowReceiptModal(true);
    }, 3000);
  };

  const handleSaveReceipt = () => {
    if (scannedReceipt) {
      const newTransaction: Transaction = {
        id: scannedReceipt.id,
        description: scannedReceipt.merchant,
        amount: scannedReceipt.amount,
        category: scannedReceipt.category,
        date: scannedReceipt.date,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'scanned'
      };

      setTransactions([newTransaction, ...transactions]);
      setCurrentTrip(prev => ({
        ...prev,
        spent: prev.spent + scannedReceipt.amount
      }));

      setShowReceiptModal(false);
      setScannedReceipt(null);
      
      Alert.alert(
        '✅ Receipt Saved!',
        `€${scannedReceipt.amount} expense from ${scannedReceipt.merchant} has been added to your budget.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleEditReceipt = (field: keyof ScannedReceipt, value: string | number) => {
    if (scannedReceipt) {
      setScannedReceipt({
        ...scannedReceipt,
        [field]: value
      });
    }
  };

  const categories = ['Food & Dining', 'Accommodation', 'Transportation', 'Activities', 'Shopping', 'Entertainment'];

  const recentTransactions = [
    { description: 'Hotel Le Marais', amount: 120, category: 'Accommodation', date: 'Dec 16', time: '2:30 PM' },
    { description: 'Café de Flore', amount: 28, category: 'Food', date: 'Dec 16', time: '10:45 AM' },
    { description: 'Metro Day Pass', amount: 15, category: 'Transportation', date: 'Dec 15', time: '8:20 AM' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Budget Tracker</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Budget Summary */}
        <View style={styles.summaryCard}>
          <LinearGradient
            colors={[COLORS.orange50, COLORS.amber50]}
            style={styles.summaryGradient}
          >
            <Text style={styles.summaryTitle}>Paris Trip Budget</Text>
            
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryAmount, { color: COLORS.orange600 }]}>
                  ${currentTrip.budget}
                </Text>
                <Text style={styles.summaryLabel}>Total Budget</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryAmount, { color: COLORS.green600 }]}>
                  ${currentTrip.spent}
                </Text>
                <Text style={styles.summaryLabel}>Spent</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryAmount, { color: COLORS.amber600 }]}>
                  ${currentTrip.budget - currentTrip.spent}
                </Text>
                <Text style={styles.summaryLabel}>Remaining</Text>
              </View>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Budget Progress</Text>
                <Text style={styles.progressPercentage}>
                  {Math.round((currentTrip.spent / currentTrip.budget) * 100)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(currentTrip.spent / currentTrip.budget) * 100}%` }
                  ]} 
                />
              </View>
            </View>

            <View style={styles.dailyAverage}>
              <Text style={styles.dailyLabel}>Daily average so far</Text>
              <Text style={styles.dailyAmount}>${Math.round(currentTrip.spent / 3)}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* AI Bill Scanner */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI Bill Scanner</Text>
            <View style={styles.aiIndicator}>
              <MaterialIcons name="auto-awesome" size={14} color={COLORS.orange600} />
              <Text style={styles.aiIndicatorText}>Smart</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.scannerCard} onPress={handleScanReceipt}>
            <LinearGradient
              colors={[COLORS.blue50, COLORS.orange50]}
              style={styles.scannerGradient}
            >
              <MaterialIcons name="camera-alt" size={32} color={COLORS.orange600} />
              <View style={styles.scannerContent}>
                <Text style={styles.scannerTitle}>Scan Receipt with AI</Text>
                <Text style={styles.scannerDescription}>
                  Auto-categorize expenses • Extract merchant details • Currency conversion
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={COLORS.orange600} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* AI Spending Insights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Smart Spending Insights</Text>
            <View style={styles.aiIndicator}>
              <MaterialIcons name="psychology" size={14} color={COLORS.orange600} />
              <Text style={styles.aiIndicatorText}>AI Powered</Text>
            </View>
          </View>
          
          <View style={styles.insightCard}>
            <LinearGradient
              colors={[COLORS.green50, COLORS.blue50]}
              style={styles.insightGradient}
            >
              <MaterialIcons name="trending-up" size={20} color={COLORS.green600} />
              <Text style={styles.insightText}>
                You're 32% under budget on food! Consider trying that Michelin restaurant you bookmarked.
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.insightCard}>
            <LinearGradient
              colors={[COLORS.amber50, COLORS.orange50]}
              style={styles.insightGradient}
            >
              <MaterialIcons name="lightbulb" size={20} color={COLORS.amber600} />
              <Text style={styles.insightText}>
                Peak season alert: Activities cost 15% more after Dec 20th. Book now to save €80.
              </Text>
            </LinearGradient>
          </View>
        </View>

        {/* Budget Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Breakdown</Text>
          {budgetCategories.map((item, index) => (
            <View key={index} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryIcon, { backgroundColor: `${item.color}20` }]}>
                  <MaterialIcons name={item.icon as any} size={20} color={item.color} />
                </View>
                <View style={styles.categoryInfo}>
                  <View style={styles.categoryTitleRow}>
                    <Text style={styles.categoryTitle}>{item.category}</Text>
                    <Text style={styles.categoryPercentage}>
                      {Math.round((item.amount / item.budget) * 100)}%
                    </Text>
                  </View>
                  <View style={styles.categoryAmountRow}>
                    <Text style={styles.categoryAmount}>${item.amount} of ${item.budget}</Text>
                    <Text style={styles.categoryRemaining}>${item.budget - item.amount} left</Text>
                  </View>
                </View>
              </View>
              <View style={styles.categoryProgress}>
                <View 
                  style={[
                    styles.categoryProgressFill, 
                    { width: `${(item.amount / item.budget) * 100}%`, backgroundColor: item.color }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {recentTransactions.map((transaction, index) => (
            <View key={index} style={styles.transactionCard}>
              <View style={styles.transactionContent}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text style={styles.transactionMeta}>
                    {transaction.category} • {transaction.date} at {transaction.time}
                  </Text>
                </View>
                <Text style={styles.transactionAmount}>${transaction.amount}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Smart Budget Tip */}
        <View style={styles.tipCard}>
          <LinearGradient
            colors={[COLORS.green50, COLORS.blue50]}
            style={styles.tipGradient}
          >
            <View style={styles.tipHeader}>
              <MaterialIcons name="trending-up" size={16} color={COLORS.green600} />
              <Text style={styles.tipTitle}>Smart Budget Tip</Text>
            </View>
            <Text style={styles.tipDescription}>
              You're 18% under budget for food! Consider trying a Michelin-starred restaurant for a special dinner.
            </Text>
            <View style={styles.tipBadge}>
              <Text style={styles.tipBadgeText}>On Track</Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowCamera(false)}
      >
        <View style={styles.cameraContainer}>
          <View style={styles.cameraHeader}>
            <TouchableOpacity 
              onPress={() => setShowCamera(false)}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.cameraTitle}>Scan Receipt</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.cameraPreview}>
            {isScanning ? (
              <View style={styles.scanningOverlay}>
                <MaterialIcons name="camera-alt" size={80} color={COLORS.primary} />
                <Text style={styles.scanningText}>AI is analyzing your receipt...</Text>
                <View style={styles.loadingDots}>
                  <View style={[styles.dot, styles.dot1]} />
                  <View style={[styles.dot, styles.dot2]} />
                  <View style={[styles.dot, styles.dot3]} />
                </View>
              </View>
            ) : (
              <View style={styles.cameraViewfinder}>
                <MaterialIcons name="crop-free" size={200} color={COLORS.primary} />
                <Text style={styles.viewfinderText}>Position receipt within frame</Text>
              </View>
            )}
          </View>

          {!isScanning && (
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={simulateReceiptCapture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          )}
        </View>
      </Modal>

      {/* Receipt Confirmation Modal */}
      <Modal
        visible={showReceiptModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReceiptModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.receiptModal}>
            <View style={styles.receiptHeader}>
              <Text style={styles.receiptTitle}>Receipt Scanned Successfully</Text>
              <TouchableOpacity 
                onPress={() => setShowReceiptModal(false)}
                style={styles.modalCloseButton}
              >
                <MaterialIcons name="close" size={24} color={COLORS.gray600} />
              </TouchableOpacity>
            </View>

            {scannedReceipt && (
              <ScrollView style={styles.receiptContent}>
                <View style={styles.confidenceIndicator}>
                  <MaterialIcons name="check-circle" size={16} color={COLORS.green600} />
                  <Text style={styles.confidenceText}>{scannedReceipt.confidence}% Confidence</Text>
                </View>

                <View style={styles.receiptField}>
                  <Text style={styles.fieldLabel}>Merchant</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={scannedReceipt.merchant}
                    onChangeText={(text) => handleEditReceipt('merchant', text)}
                  />
                </View>

                <View style={styles.receiptField}>
                  <Text style={styles.fieldLabel}>Amount (€)</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={scannedReceipt.amount.toString()}
                    onChangeText={(text) => handleEditReceipt('amount', parseFloat(text) || 0)}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.receiptField}>
                  <Text style={styles.fieldLabel}>Category</Text>
                  <View style={styles.categoryPicker}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.categoryOption,
                          scannedReceipt.category === category && styles.categorySelected
                        ]}
                        onPress={() => handleEditReceipt('category', category)}
                      >
                        <Text
                          style={[
                            styles.categoryText,
                            scannedReceipt.category === category && styles.categoryTextSelected
                          ]}
                        >
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.receiptField}>
                  <Text style={styles.fieldLabel}>Items</Text>
                  <View style={styles.itemsList}>
                    {scannedReceipt.items.map((item, index) => (
                      <Text key={index} style={styles.itemText}>• {item}</Text>
                    ))}
                  </View>
                </View>

                <View style={styles.receiptActions}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setShowReceiptModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={handleSaveReceipt}
                  >
                    <Text style={styles.saveButtonText}>Save Expense</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gray900,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  summaryGradient: {
    padding: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray900,
    textAlign: 'center',
    marginBottom: 24,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 7,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.gray600,
    textAlign: 'center',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  progressBar: {
    height: 12,
    backgroundColor: COLORS.gray100,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.gray900,
    borderRadius: 6,
  },
  dailyAverage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 7,
    padding: 12,
  },
  dailyLabel: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  dailyAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.gray900,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray900,
    marginBottom: 12,
  },
  categoryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 7,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray900,
  },
  categoryPercentage: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray600,
  },
  categoryAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryAmount: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  categoryRemaining: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  categoryProgress: {
    height: 8,
    backgroundColor: COLORS.gray100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  transactionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 7,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  transactionMeta: {
    fontSize: 12,
    color: COLORS.gray600,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray900,
  },
  tipCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  tipGradient: {
    padding: 16,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray900,
  },
  tipDescription: {
    fontSize: 14,
    color: COLORS.gray600,
    marginBottom: 12,
    lineHeight: 20,
  },
  tipBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderColor: COLORS.green600,
    borderWidth: 1,
    borderRadius: 4,
  },
  tipBadgeText: {
    fontSize: 12,
    color: COLORS.green600,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.orange50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  aiIndicatorText: {
    fontSize: 12,
    color: COLORS.orange600,
    fontWeight: '500',
  },
  scannerCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  scannerGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scannerContent: {
    flex: 1,
  },
  scannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  scannerDescription: {
    fontSize: 14,
    color: COLORS.gray600,
    lineHeight: 20,
  },
  insightCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  insightGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.gray600,
    lineHeight: 20,
  },
  
  // Camera Modal Styles
  cameraContainer: {
    flex: 1,
    backgroundColor: COLORS.gray900,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  cameraTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  placeholder: {
    width: 40,
  },
  cameraPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cameraViewfinder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  viewfinderText: {
    fontSize: 16,
    color: COLORS.white,
    marginTop: 20,
    textAlign: 'center',
  },
  scanningOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  scanningText: {
    fontSize: 18,
    color: COLORS.white,
    marginTop: 20,
    textAlign: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginHorizontal: 4,
  },
  dot1: {
    opacity: 1,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 0.5,
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
  },
  
  // Receipt Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiptModal: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  modalCloseButton: {
    padding: 8,
  },
  receiptContent: {
    padding: 20,
  },
  confidenceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: COLORS.green50,
    borderRadius: 8,
  },
  confidenceText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.green600,
  },
  receiptField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray600,
    marginBottom: 8,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: COLORS.gray100,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.gray900,
  },
  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    backgroundColor: COLORS.gray50,
  },
  categorySelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.gray600,
  },
  categoryTextSelected: {
    color: COLORS.white,
  },
  itemsList: {
    backgroundColor: COLORS.gray50,
    borderRadius: 8,
    padding: 12,
  },
  itemText: {
    fontSize: 14,
    color: COLORS.gray600,
    marginBottom: 4,
  },
  receiptActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray600,
  },
  saveButton: {
    flex: 2,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});