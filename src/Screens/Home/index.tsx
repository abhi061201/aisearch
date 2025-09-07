import React, { useCallback } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import TextInputField from '../../components/TextInputField';
import SortFilter from '../../components/filters';
import { getSortDescription } from '../../utils/sortUtils';
import { useAdvisory } from './useAdvisory';
import { Recommendation } from '../../interfaces/Recommendation';

const AdvisorScreen = () => {
  // Use custom hook for all business logic
  const {
    query,
    recommendations,
    loading,
    summary,
    sortOption,
    sortedRecommendations,
    isSummaryExpanded,
    setQuery,
    setSortOption,
    handleQuerySubmit,
    toggleSummaryExpansion,
    getTruncatedSummary,
  } = useAdvisory();

  const renderListHeader = useCallback(
    () => (
      <>
        {summary ? (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <Text style={styles.summaryText}>
              {isSummaryExpanded ? summary : getTruncatedSummary(summary).text}
              {getTruncatedSummary(summary).needsReadMore && (
                <Text 
                  style={styles.readMoreText}
                  onPress={toggleSummaryExpansion}
                >
                  {isSummaryExpanded ? ' Read Less' : ' Read More'}
                </Text>
              )}
            </Text>
          </View>
        ) : null}

        {recommendations.length > 0 && (
          <>
            <SortFilter
              selectedSort={sortOption}
              onSortChange={setSortOption}
              disabled={loading}
            />
            <View style={styles.recommendationsHeader}>
              <Text style={styles.recommendationsTitle}>
                Recommended Products
              </Text>
              <Text style={styles.sortDescription}>
                {getSortDescription(sortOption)}
              </Text>
            </View>
          </>
        )}
      </>
    ),
    [summary, recommendations, sortOption, loading, isSummaryExpanded, getTruncatedSummary, toggleSummaryExpansion],
  );

  const renderRecommendationItem = useCallback(
    ({ item, index }: { item: Recommendation; index: number }) => (
      <View key={index} style={styles.recommendationCard}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{item.product.product_name}</Text>
          <Text style={styles.brand}>{item.product.brand}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            ₹{item.product.price.toLocaleString()}
          </Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Match Score:</Text>
            <Text style={styles.score}>{item.match_score}/10</Text>
          </View>
        </View>

        <Text style={styles.category}>{item.product.category}</Text>
        <Text style={styles.description}>{item.product.description}</Text>

        <View style={styles.explanationContainer}>
          <Text style={styles.explanationTitle}>
            Why this matches your needs:
          </Text>
          <Text style={styles.explanation}>{item.explanation}</Text>
        </View>
      </View>
    ),
    [sortedRecommendations],
  );

  const renderEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {loading 
            ? '🤖 Finding the best products for you...' 
            : '💡 Enter your needs above to get smart product recommendations'
          }
        </Text>
      </View>
    ),
    [loading],
  );

  const renderListFooter = useCallback(
    () => <View style={styles.footerContainer}></View>,
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Product Advisor</Text>
        <Text style={styles.subtitle}>
          Describe what you need in plain English
        </Text>
      </View>

      <TextInputField
        query={query}
        onQueryChange={setQuery}
        onSubmit={handleQuerySubmit}
        loading={loading}
      />

      <FlatList
        style={styles.flatListContainer}
        data={sortedRecommendations}
        renderItem={renderRecommendationItem}
        keyExtractor={(item, index) =>
          `${item.product.brand}-${item.product.product_name}-${index}`
        }
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderListFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        removeClippedSubviews={false}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        initialNumToRender={3}
        windowSize={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  flatListContainer: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
  },
  learningSubtext: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#bdc3c7',
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: '#e8f4fd',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
  readMoreText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  recommendationsHeader: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  sortDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  recommendationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productHeader: {
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  brand: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginRight: 4,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  category: {
    fontSize: 12,
    color: '#3498db',
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
    marginBottom: 16,
  },
  explanationContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#f39c12',
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 6,
  },
  explanation: {
    fontSize: 13,
    color: '#34495e',
    lineHeight: 18,
  },
  footerContainer: {
    height: 40,
  },
});

export default AdvisorScreen;
