import OpenAI from 'openai';
import { getMockCoachResponse } from './mockCoachService';
import config from '../../config/environment';

// Connection status tracking
let connectionStatus: 'unknown' | 'connected' | 'failed' = 'unknown';
let lastError: string | null = null;

// Initialize OpenAI client with enhanced configuration
const openaiClient = config.openaiApiKey ? new OpenAI({
  apiKey: config.openaiApiKey,
  // React Native specific configuration
  dangerouslyAllowBrowser: true,
  timeout: 15000, // 15 second timeout
  maxRetries: 2,
}) : null;

// Enhanced logging and validation
if (!openaiClient) {
  console.warn('🔄 No OpenAI API key configured, will use mock responses');
  if (config.mockResponses) {
    console.log('✅ Mock responses enabled via MOCK_RESPONSES=true');
  }
} else {
  console.log('🔑 OpenAI client initialized with API key');
}

// API key validation function
export const validateApiKey = async (): Promise<{ valid: boolean; error?: string }> => {
  if (!openaiClient) {
    return { valid: false, error: 'No API key configured' };
  }

  try {
    // Test API key with minimal request
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 1,
    });
    
    connectionStatus = 'connected';
    console.log('✅ OpenAI API key validation successful');
    return { valid: true };
  } catch (error) {
    connectionStatus = 'failed';
    lastError = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ OpenAI API key validation failed:', lastError);
    return { valid: false, error: lastError };
  }
};

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const getLLMResponse = async (
  message: string,
  history: ChatMessage[],
  systemPrompt: string,
  coachType: 'gentle' | 'wise' | 'earthly' = 'gentle',
  temperature: number = 0.7
): Promise<string> => {
  // Force mock responses if configured
  if (config.mockResponses) {
    if (config.debugMode) {
      console.log('🎭 Using mock response (MOCK_RESPONSES=true)');
    }
    return getMockCoachResponse(message, coachType);
  }

  // Fallback to mock if no API key
  if (!openaiClient) {
    if (config.debugMode) {
      console.log('🎭 Using mock response (no API key)');
    }
    return getMockCoachResponse(message, coachType);
  }

  try {
    // Prepare messages with system prompt
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    if (config.debugMode) {
      console.log('🚀 Sending request to OpenAI API...');
      console.log('📝 Message:', message);
      console.log('🎯 Model:', config.llmModel);
      console.log('🌡️ Temperature:', temperature);
    }

    const completion = await openaiClient.chat.completions.create({
      model: config.llmModel,
      messages: messages,
      temperature: temperature,
      max_tokens: config.llmMaxTokens,
      presence_penalty: 0.6, // Encourage variety
      frequency_penalty: 0.3, // Reduce repetition
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from LLM');
    }

    connectionStatus = 'connected';
    lastError = null;
    
    if (config.debugMode) {
      console.log('✅ OpenAI API response received');
      console.log('📄 Response:', response.substring(0, 100) + '...');
      console.log('🎯 Usage:', completion.usage);
    }

    return response.trim();
  } catch (error) {
    connectionStatus = 'failed';
    lastError = error instanceof Error ? error.message : 'Unknown error';
    
    console.error('❌ OpenAI API Error:', lastError);
    
    if (config.debugMode) {
      console.log('🎭 Falling back to mock response');
    }
    
    // Fallback to mock response on error
    return getMockCoachResponse(message, coachType);
  }
};

// Get current connection status
export const getConnectionStatus = () => ({
  status: connectionStatus,
  error: lastError,
  hasApiKey: !!openaiClient,
  mockMode: config.mockResponses,
});

// Helper to estimate token count (rough approximation)
export const estimateTokens = (text: string): number => {
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
};

// Calculate cost for GPT-3.5-turbo
export const calculateCost = (inputTokens: number, outputTokens: number): number => {
  // GPT-3.5-turbo pricing (as of late 2024)
  const inputCostPer1K = 0.0005; // $0.0005 per 1K input tokens
  const outputCostPer1K = 0.0015; // $0.0015 per 1K output tokens
  
  const inputCost = (inputTokens / 1000) * inputCostPer1K;
  const outputCost = (outputTokens / 1000) * outputCostPer1K;
  
  return inputCost + outputCost;
};