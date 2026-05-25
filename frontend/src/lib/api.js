import axios from 'axios';
import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
};

const getHeaders = async () => {
  const token = await getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const optimizeQuery = async (query, db_type, explanation_level = 'Intermediate') => {
  const headers = await getHeaders();
  const response = await axios.post(`${API_URL}/optimize`, { query, db_type, explanation_level }, { headers });
  return response.data;
};

export const saveHistory = async (query, result, db_type) => {
  const headers = await getHeaders();
  const response = await axios.post(`${API_URL}/history/save`, {
    original_query: query,
    optimized_query: result.optimized_query,
    issues_found: result.issues_found,
    index_suggestions: result.index_suggestions,
    index_sql: result.index_sql,
    performance_gain: result.performance_gain,
    explanation: result.explanation,
    complexity_score: result.complexity_score,
    estimated_execution_time_before: result.estimated_execution_time_before,
    estimated_execution_time_after: result.estimated_execution_time_after,
    query_risk_level: result.query_risk_level,
    detected_risks: result.detected_risks,
    db_type
  }, { headers });
  return response.data;
};

export const getHistory = async () => {
  const headers = await getHeaders();
  const response = await axios.get(`${API_URL}/history`, { headers });
  return response.data;
};

export const deleteHistory = async (id) => {
  const headers = await getHeaders();
  const response = await axios.delete(`${API_URL}/history/${id}`, { headers });
  return response.data;
};

export const toggleFavorite = async (id, is_favorite) => {
  const headers = await getHeaders();
  const response = await axios.patch(`${API_URL}/history/${id}/favorite`, { is_favorite }, { headers });
  return response.data;
};

export const togglePublic = async (id, is_public) => {
  const headers = await getHeaders();
  const response = await axios.patch(`${API_URL}/history/${id}/public`, { is_public }, { headers });
  return response.data;
};

export const getSharedQuery = async (id) => {
  const response = await axios.get(`${API_URL}/history/public/${id}`);
  return response.data;
};
