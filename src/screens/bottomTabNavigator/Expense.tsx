import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../../constants/colors'
import { Ionicons } from '@react-native-vector-icons/ionicons';
import LinearGradient from 'react-native-linear-gradient';
import typography from '../../constants/typography';
import { TransactionCard, TransactionData } from '../../components/TransactionCard';

const SAMPLE_TX: TransactionData[] = [
  {
    id: '1',
    title: 'Shopping',
    subtitle: '15 Transaction · Today',
    amount: -5000,
    type: 'expense',
    timestamp: new Date(),
    category: 'Shopping',
    transactionMethod: 'Credit Card',
    notes: 'Monthly groceries and household items',
  },
  {
    id: '2',
    title: 'Shameel',
    subtitle: '15 Transaction · Today',
    amount: 4000,
    type: 'income',
    timestamp: new Date(),
    category: 'Transfer',
    transactionMethod: 'Bank Transfer',
    notes: 'Payment received for project work',
  },
  {
    id: '3',
    title: 'Shopping',
    subtitle: '15 Transaction · Today',
    amount: -5000,
    type: 'expense',
    timestamp: new Date(),
    category: 'Shopping',
    transactionMethod: 'Debit Card',
    notes: 'Electronics purchase',
  },
  {
    id: '4',
    title: 'Shameel',
    subtitle: '15 Transaction · Today',
    amount: 4000,
    type: 'income',
    timestamp: new Date(),
    category: 'Transfer',
    transactionMethod: 'Bank Transfer',
    notes: 'Payment received for project work',
  },
  {
    id: '5',
    title: 'Shopping',
    subtitle: '15 Transaction · Today',
    amount: -5000,
    type: 'expense',
    timestamp: new Date(),
    category: 'Shopping',
    transactionMethod: 'Debit Card',
    notes: 'Electronics purchase',
  },
  {
    id: '6',
    title: 'Shameel',
    subtitle: '15 Transaction · Today',
    amount: 4000,
    type: 'income',
    timestamp: new Date(),
    category: 'Transfer',
    transactionMethod: 'Bank Transfer',
    notes: 'Payment received for project work',
  },
  {
    id: '7',
    title: 'Shopping',
    subtitle: '15 Transaction · Today',
    amount: -5000,
    type: 'expense',
    timestamp: new Date(),
    category: 'Shopping',
    transactionMethod: 'Debit Card',
    notes: 'Electronics purchase',
  },
]

export default function Expense() {
  const [isBalanceVisible, setIsBalanceVisible] = React.useState(true);

  const handleTransactionPress = (id: string) => {
    console.log('Transaction pressed:', id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.TopContainer}>
        <View style={styles.header}>
          <View style={styles.profile}>

            <TouchableOpacity style={styles.avatar}>
              <Image
                source={require('../../../assets/pic.png')}
                style={styles.avatarImage}
              />
            </TouchableOpacity>

            <View style={styles.profileTextContainer}>
              <Text style={styles.hello}>Hello,</Text>
              <Text style={styles.name}>Abrar Ali</Text>
            </View>
          </View>


          <TouchableOpacity style={styles.searchPlaceholder}>
            <Ionicons name="search" size={20} color={Colors.primaryBlack} />
          </TouchableOpacity>
        </View>

        <Text style={styles.overviewLabel}>Overview</Text>
        <View style={styles.balanceRow}>
          <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)} style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <Text style={styles.balance}>{isBalanceVisible ? "5000" : "****"}</Text>
            <Ionicons name={isBalanceVisible ? "eye-off" : "eye"} size={24} color={Colors.primaryBlack} style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>


        <View style={styles.balanceStatsRow}>
          <View style={styles.currentBalanceContainer}>
            <Text style={styles.currentBalanceLabel}>Current Balance</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.leftStat}>
              <View style={styles.statTopRow}>
                <Text style={styles.statAmountNegative}>78900</Text>
                <Ionicons name="trending-down" size={16} color={Colors.negativeColor} />
              </View>
              <View style={styles.statBottomRow}>
                <Text style={styles.statLabel}>30 Days</Text>
              </View>
            </View>

            <View style={styles.rightStat}>
              <View style={styles.statTopRow}>
                <Text style={styles.statAmountPositive}>1500</Text>
                <Ionicons name="trending-up" size={16} color={Colors.positiveColor} />
              </View>
              <View style={styles.statBottomRow}>
                <Text style={styles.statLabel}>7 Days</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.NavigationRow}>
          <TouchableOpacity style={styles.navigationCardLeft}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['rgba(255, 241, 246, 0.95)', '#FFE3F4']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.leftContainer}
            >
              <View style={styles.cardIcon}>
                <Image
                  source={require('../../../assets/images/expenseIcons/pay&recive.png')}
                  style={{ width: 72, height: 72 }}
                />
              </View>

              <Text style={styles.cardTitle}>Pay & Receive</Text>
              <Text style={styles.cardAmount}>+ 5000</Text>

            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navigationCardRight}
            activeOpacity={0.9}>
            <LinearGradient
              colors={['#E8E7FF', '#D8D6F2']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.rightContainer}
            >
              <View style={styles.cardIcon}>
                <Image

                  source={require('../../../assets/images/expenseIcons/spending.png')}
                  style={{ width: 72, height: 72 }}
                />
              </View>
              <Text style={styles.cardTitle}>Spending</Text>
              <Text style={styles.cardAmountRight}>- 9500</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.txHeaderLine} />

        <View style={styles.txHeaderRow}>
          <TouchableOpacity>
            <Image
              source={require('../../../assets/images/expenseIcons/filter.png')}
              style={{ width: 16, height: 16 }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.recentLabel}>Recent Transactions</Text>

      </View>
      <ScrollView style={styles.transactionList}>
        {SAMPLE_TX.map(transaction => (
          <TransactionCard
            key={transaction.id}
            data={transaction}
            onPress={handleTransactionPress}
            style={styles.transactionCard}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FEFF',
  },
  container: {
    padding: 16,
  },
  TopContainer: {
    height: 320,
    backgroundColor: 'rgba(225, 239, 210, 0.37)',
    padding: 16,
    width: '100%',
  },

  mainScrollView: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DDE7FF',
  },

  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  profileTextContainer: {
    marginLeft: 16,
  },

  hello: {
    ...typography.bodySmall,
    color: Colors.secondaryBlack,
  },

  name: {
    ...typography.bodyLarge,
    color: Colors.primaryBlack,
  },

  searchPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },

  overviewLabel: {
    ...typography.heading2,
    marginTop: 12,
    color: Colors.secondaryBlack,
  },

  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 16,

  },

  balance: {
    ...typography.heading1,
    marginTop: 8,
    color: Colors.primaryBlack,
  },

  eyeIcon: {
    marginTop: 6,
  },

  balanceStatsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  currentBalanceContainer: {
    flex: 0,
  },

  currentBalanceLabel: {
    ...typography.bodyMedium,
    fontWeight: '300',
    fontFamily: 'YaldeviColombo-Light',
    color: Colors.secondaryBlack,
  },

  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 8,
    marginTop: -16,
  },

  leftStat: {
    alignItems: 'flex-start',
  },

  rightStat: {
    alignItems: 'flex-start',
  },

  statTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  statAmountNegative: {
    ...typography.statsAmount,
    color: Colors.negativeColor,
  },

  statAmountPositive: {
    ...typography.statsAmount,
    color: Colors.positiveColor,
  },

  statBottomRow: {
    marginTop: 4,
  },

  statLabel: {
    ...typography.statsLabel,
    fontSize: 16,
    color: Colors.secondaryBlack,
    alignItems: 'center',
  },

  NavigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
    paddingHorizontal: 4,
    gap: 16,
  },
  leftContainer: {
    height: 160,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.25,
    borderColor: Colors.secondaryBlack,
    elevation: 2,
    shadowColor: Colors.primaryBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rightContainer: {
    height: 160,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.25,
    borderColor: Colors.secondaryBlack,
    elevation: 2,
    shadowColor: Colors.primaryBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navigationCardLeft: {
    flex: 1,
    borderRadius: 30,
    overflow: 'visible',
    maxWidth: '48%',
    backgroundColor: Colors.secondaryBlack,

  },
  navigationCardRight: {
    flex: 1,
    borderRadius: 30,
    overflow: 'visible',
    maxWidth: '48%',
    backgroundColor: Colors.secondaryBlack,
  },

  cardIcon: {
    width: 72,
    height: 72,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 20,
    fontFamily: 'YaldeviColombo-SemiBold',
    color: Colors.primaryBlack,
    textAlign: 'center',
    fontStyle: 'normal' as 'normal',
    fontWeight: '600',
  },

  cardAmount: {
    marginTop: 2,
    fontSize: 20,
    fontFamily: 'YaldeviColombo-SemiBold',
    fontStyle: 'normal' as 'normal',
    fontWeight: '600',
    color: Colors.positiveColor,
    textAlign: 'center',
  },

  cardAmountRight: {

    marginTop: 2,
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'YaldeviColombo-SemiBold',
    fontStyle: 'normal' as 'normal',
    color: Colors.negativeColor,
  },

  txHeaderLine: {
    marginTop: 16,
    height: 1,
    backgroundColor: '#0000004d',
    zIndex: -1,
  },

  txHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },

  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondaryBlack,
    fontFamily: 'YaldeviColombo-SemiBold',
    fontStyle: 'normal' as 'normal',
  },

  recentLabel: {
    fontSize: 16,
    fontWeight: '300',
    color: Colors.secondaryBlack,
    fontFamily: 'YaldeviColombo-light',
    fontStyle: 'normal' as 'normal',
    marginTop: 12,

  },

  txCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },

  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F1F5FF',
  },

  txTextContainer: {
    marginLeft: 12,
  },

  txTitle: {
    ...typography.transactionTitle,
    color: '#0B1220',
  },

  txSubtitle: {
    ...typography.transactionSubtitle,
    color: '#8A94A6',
    marginTop: 2,
  },

  txAmount: {
    ...typography.transactionAmount,
  },

  separator: {
    height: 12,
  },

  listContent: {
    paddingBottom: 40,
  },

  transactionList: {
    flex: 1,
    marginTop: 125,
    paddingHorizontal: 16,
    backgroundColor: '#F7FEFF',
  },

  transactionCard: {
    marginBottom: 12,
  },
})