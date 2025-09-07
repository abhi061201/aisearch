import { useState, useMemo, useEffect } from 'react';
import { Alert } from 'react-native';
import { getAIRecommendations } from '../../api/index';
import Products from '../../interfaces/catalog.json';
import { sortRecommendations } from '../../utils/sortUtils';
import { SortOption } from '../../components/filters';
import { AIResponse, Recommendation } from '../../interfaces/Recommendation';
import { logger } from '../../utils/logger';

export const useAdvisory = () => {
  // State management
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('match_score');
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  // Reset summary expansion when summary changes
  useEffect(() => {
    setIsSummaryExpanded(false);
  }, [summary]);

  // Computed values
  const sortedRecommendations = useMemo(() => {
    return sortRecommendations(recommendations, sortOption);
  }, [recommendations, sortOption]);

  // Helper function to truncate summary text
  const getTruncatedSummary = (text: string, maxLines: number = 2) => {
    const words = text.split(' ');
    const wordsPerLine = 15; // Approximate words per line
    const maxWords = maxLines * wordsPerLine;
    
    if (words.length <= maxWords) {
      return { text, needsReadMore: false };
    }
    
    return {
      text: words.slice(0, maxWords).join(' ') + '...',
      needsReadMore: true
    };
  };

  // Business logic functions
  const handleQuerySubmit = async () => {
    if (!query.trim()) {
      Alert.alert('Error', 'Please enter your product needs');
      return;
    }

    setLoading(true);
    try {
      const aiResponse: AIResponse = await getAIRecommendations(query, Products);

      if (aiResponse.error) {
        Alert.alert('Error', aiResponse.summary);
      } else {
        setRecommendations(aiResponse.recommendations);
        setSummary(aiResponse.summary);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get recommendations. Please try again.');
      logger.error('Error getting recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setRecommendations([]);
    setSummary('');
    setIsSummaryExpanded(false);
  };

  const toggleSummaryExpansion = () => {
    setIsSummaryExpanded(!isSummaryExpanded);
  };

  // Return all state and functions needed by the component
  return {
    // State
    query,
    recommendations,
    loading,
    summary,
    sortOption,
    sortedRecommendations,
    isSummaryExpanded,
    
    // Actions
    setQuery,
    setSortOption,
    handleQuerySubmit,
    clearResults,
    toggleSummaryExpansion,
    
    // Helper functions
    getTruncatedSummary,
  };
};
