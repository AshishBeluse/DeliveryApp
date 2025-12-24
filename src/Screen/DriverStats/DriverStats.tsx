import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import useStyles from './DriverStatsStyles';
import { useTheme } from '../../utils/theme/ThemeProvider';

interface DriverStatsProps {
  todayEarnings: number;
  completedToday: number;
  activeOrders: number;
  loading?: boolean;
}

const DriverStats: React.FC<DriverStatsProps> = ({
  todayEarnings,
  completedToday,
  activeOrders,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/* Today Earnings */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Icon name="dollar-sign" size={16} color={theme.colors.primary} />
          <Text style={styles.label}>Today</Text>
        </View>
        <Text style={[styles.valueGreen, { color: theme.colors.primary }]}>
          ${todayEarnings.toFixed(2)}
        </Text>
      </View>

      {/* Completed */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Icon name="check-circle" size={16} color={theme.colors.primary} />
          <Text style={styles.label}>Completed</Text>
        </View>
        <Text style={styles.value}>{completedToday}</Text>
      </View>

      {/* Active Orders */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Icon name="package" size={16} color={theme.colors.primary} />
          <Text style={styles.label}>Active</Text>
        </View>
        <Text style={styles.value}>{activeOrders}</Text>
      </View>
    </View>
  );
};

export default DriverStats;
