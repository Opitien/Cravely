import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Platform,
  StatusBar,
  Alert,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePayment, SavedCard } from '../../src/context/PaymentContext';
import Colors from '../../src/constants/Colors';
import Typography from '../../src/constants/Typography';

// Which brand's icon to show based on the card number
function getCardIcon(brand: string) {
  switch (brand.toLowerCase()) {
    case 'mastercard': return '🟠';
    case 'amex': return '💠';
    default: return '💳'; // Visa and others
  }
}

function CardItem({ card, isActive, onSelect, onRemove }: {
  card: SavedCard;
  isActive: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.cardItem, isActive && styles.cardItemActive]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      <View style={styles.cardLeft}>
        <Text style={styles.cardIcon}>{getCardIcon(card.brand)}</Text>
        <View>
          <Text style={styles.cardBrand}>{card.brand} •••• {card.last4}</Text>
          <Text style={styles.cardMeta}>{card.holderName} · Expires {card.expiry}</Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        {isActive && (
          <View style={styles.activeBadge}>
            <Ionicons name="checkmark" size={12} color="white" />
          </View>
        )}
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={onRemove}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function SavedCardsScreen() {
  const router = useRouter();
  const { savedCards, activeCardId, addCard, removeCard, setActiveCard } = usePayment();

  // Modal state for adding a new card
  const [showModal, setShowModal] = useState(false);
  const [holderName, setHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');

  const handleAdd = () => {
    if (!holderName || cardNumber.length < 4 || !expiry) {
      Alert.alert('Incomplete', 'Please fill in all card details.');
      return;
    }
    const last4 = cardNumber.slice(-4);
    // Detect brand from first digit
    const brand = cardNumber.startsWith('5') ? 'Mastercard' : 'Visa';
    addCard({ last4, brand, expiry, holderName });
    // Reset form
    setHolderName(''); setCardNumber(''); setExpiry('');
    setShowModal(false);
  };

  const handleRemove = (card: SavedCard) => {
    Alert.alert('Remove Card', `Remove ${card.brand} •••• ${card.last4}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeCard(card.id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Cards</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={22} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      {savedCards.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>💳</Text>
          <Text style={styles.emptyText}>No saved cards yet.</Text>
          <TouchableOpacity style={styles.addCardBtn} onPress={() => setShowModal(true)}>
            <Text style={styles.addCardBtnText}>+ Add a Card</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={savedCards}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <CardItem
              card={item}
              isActive={item.id === activeCardId}
              onSelect={() => setActiveCard(item.id)}
              onRemove={() => handleRemove(item)}
            />
          )}
          ListFooterComponent={
            <TouchableOpacity style={styles.addCardBtn} onPress={() => setShowModal(true)}>
              <Ionicons name="add-circle-outline" size={18} color={Colors.light.primary} style={{ marginRight: 6 }} />
              <Text style={styles.addCardBtnText}>Add New Card</Text>
            </TouchableOpacity>
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Card Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Card</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#111" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Opitien E."
                  placeholderTextColor="#bbb"
                  value={holderName}
                  onChangeText={setHolderName}
                  autoCapitalize="words"
                />
              </View>

              <Text style={styles.inputLabel}>Card Number</Text>
              <View style={styles.inputRow}>
                <Ionicons name="card-outline" size={20} color="#aaa" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.input}
                  placeholder="•••• •••• •••• ••••"
                  placeholderTextColor="#bbb"
                  keyboardType="numeric"
                  maxLength={16}
                  value={cardNumber}
                  onChangeText={setCardNumber}
                />
              </View>

              <Text style={styles.inputLabel}>Expiry Date</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  placeholderTextColor="#bbb"
                  keyboardType="numeric"
                  maxLength={5}
                  value={expiry}
                  onChangeText={setExpiry}
                />
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
                <Text style={styles.saveBtnText}>Save Card</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
    color: '#111',
  },
  addBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#FFF0F0',
    alignItems: 'center', justifyContent: 'center',
  },

  list: { padding: 16, gap: 12 },

  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardItemActive: {
    borderColor: Colors.light.primary,
    backgroundColor: '#FFF8F8',
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: { fontSize: 28 },
  cardBrand: { fontSize: Typography.sizes.medium, fontWeight: Typography.weights.bold, color: '#111' },
  cardMeta: { fontSize: Typography.sizes.small, color: '#888', marginTop: 2 },
  cardRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  activeBadge: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.light.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  removeBtn: { padding: 4 },

  addCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderStyle: 'dashed',
    marginTop: 4,
  },
  addCardBtnText: {
    color: Colors.light.primary,
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.medium,
  },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  emptyEmoji: { fontSize: 56 },
  emptyText: { fontSize: Typography.sizes.medium, color: '#888' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: '#111',
  },
  inputLabel: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.bold,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
  },
  input: {
    flex: 1,
    fontSize: Typography.sizes.medium,
    color: '#111',
  },
  saveBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  saveBtnText: {
    color: 'white',
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
  },
});
