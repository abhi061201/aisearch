import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export type SortOption = 'match_score' | 'price_low_to_high' | 'price_high_to_low';

interface SortFilterProps {
  selectedSort: SortOption;
  onSortChange: (sortOption: SortOption) => void;
  disabled?: boolean;
}

const SortFilter: React.FC<SortFilterProps> = ({
  selectedSort,
  onSortChange,
  disabled = false
}) => {
  const sortOptions = [
    { key: 'match_score' as SortOption, label: 'Best Match', icon: '🎯' },
    { key: 'price_low_to_high' as SortOption, label: 'Price: Low to High', icon: '💰' },
    { key: 'price_high_to_low' as SortOption, label: 'Price: High to Low', icon: '💎' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sort by:</Text>
      <View style={styles.optionsContainer}>
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.optionButton,
              selectedSort === option.key && styles.selectedOption,
              disabled && styles.disabledOption
            ]}
            onPress={() => !disabled && onSortChange(option.key)}
            disabled={disabled}
          >
            <Text style={styles.optionIcon}>{option.icon}</Text>
            <Text
              style={[
                styles.optionText,
                selectedSort === option.key && styles.selectedText,
                disabled && styles.disabledText
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    backgroundColor: '#f8f9fa',
    minWidth: 95,
  },
  selectedOption: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  disabledOption: {
    opacity: 0.5,
  },
  optionIcon: {
    fontSize: 14,
    marginRight: 2,
  },
  optionText: {
    fontSize: 12,
    color: '#34495e',
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  selectedText: {
    color: 'white',
    fontWeight: '600',
  },
  disabledText: {
    color: '#95a5a6',
  },
});

export default SortFilter;
