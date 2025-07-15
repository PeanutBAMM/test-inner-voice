import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getConnectionStatus, validateApiKey } from '../../../services/innervoice/llmService';

interface ConnectionStatusProps {
  style?: any;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ style }) => {
  const [status, setStatus] = useState(getConnectionStatus());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Update status every 5 seconds
    const interval = setInterval(() => {
      setStatus(getConnectionStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleValidateConnection = async () => {
    setIsValidating(true);
    await validateApiKey();
    setStatus(getConnectionStatus());
    setIsValidating(false);
  };

  const getStatusColor = () => {
    if (status.mockMode) return '#FF9500'; // Orange voor mock mode
    if (status.status === 'connected') return '#34C759'; // Green voor connected
    if (status.status === 'failed') return '#FF3B30'; // Red voor failed
    return '#8E8E93'; // Gray voor unknown
  };

  const getStatusIcon = () => {
    if (isValidating) return 'sync';
    if (status.mockMode) return 'flask';
    if (status.status === 'connected') return 'checkmark-circle';
    if (status.status === 'failed') return 'close-circle';
    return 'help-circle';
  };

  const getStatusText = () => {
    if (isValidating) return 'Validating...';
    if (status.mockMode) return 'Mock Mode';
    if (status.status === 'connected') return 'AI Connected';
    if (status.status === 'failed') return 'AI Disconnected';
    return 'Unknown';
  };

  return (
    <Animated.View style={[styles.container, style, { opacity: fadeAnim }]}>
      <TouchableOpacity
        style={[styles.statusButton, { borderColor: getStatusColor() }]}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={getStatusIcon()} 
          size={14} 
          color={getStatusColor()} 
          style={isValidating ? styles.rotating : undefined}
        />
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.detailText}>
            API Key: {status.hasApiKey ? '✅ Configured' : '❌ Missing'}
          </Text>
          <Text style={styles.detailText}>
            Mode: {status.mockMode ? '🎭 Mock Responses' : '🤖 AI Responses'}
          </Text>
          {status.error && (
            <Text style={styles.errorText}>
              Error: {status.error}
            </Text>
          )}
          
          <TouchableOpacity
            style={styles.validateButton}
            onPress={handleValidateConnection}
            disabled={isValidating || !status.hasApiKey}
          >
            <Text style={styles.validateButtonText}>
              {isValidating ? 'Validating...' : 'Test Connection'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1000,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  expandedContent: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    padding: 12,
    minWidth: 200,
    borderWidth: 1,
    borderColor: 'rgba(139, 123, 167, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 11,
    color: '#FF3B30',
    marginTop: 4,
    fontStyle: 'italic',
  },
  validateButton: {
    backgroundColor: '#FFB6C1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  validateButtonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  rotating: {
    // Animation would need to be implemented with Animated.loop
  },
});