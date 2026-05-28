const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const supabaseAdmin = require('../lib/supabase');

// Public route for shared queries
router.get('/public/:id', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('query_history')
      .select('*')
      .eq('id', req.params.id)
      .eq('is_public', true)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Query not found or not public' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// All routes below require authentication
router.use(authMiddleware);

// Save optimization result
router.post('/save', async (req, res) => {
  try {
    const { 
      original_query, 
      optimized_query, 
      issues_found, 
      index_suggestions,
      index_sql,
      performance_gain, 
      explanation,
      complexity_score,
      estimated_execution_time_before,
      estimated_execution_time_after,
      query_risk_level,
      detected_risks,
      db_type 
    } = req.body;
    
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from('query_history')
      .insert([
        {
          user_id: userId,
          original_query,
          optimized_query,
          issues_found,
          index_suggestions,
          index_sql,
          performance_gain,
          explanation,
          complexity_score,
          estimated_execution_time_before,
          estimated_execution_time_after,
          query_risk_level,
          detected_risks,
          db_type
        }
      ])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error saving history:', error);
    res.status(500).json({ error: 'Failed to save history' });
  }
});

// Fetch all history for user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabaseAdmin
      .from('query_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Fetch single history item for user
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('query_history')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Query not found' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch query' });
  }
});

// Toggle Favorite
router.patch('/:id/favorite', async (req, res) => {
  try {
    const { is_favorite } = req.body;
    const { data, error } = await supabaseAdmin
      .from('query_history')
      .update({ is_favorite })
      .match({ id: req.params.id, user_id: req.user.id })
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update favorite status' });
  }
});

// Toggle Public
router.patch('/:id/public', async (req, res) => {
  try {
    const { is_public } = req.body;
    const { data, error } = await supabaseAdmin
      .from('query_history')
      .update({ is_public })
      .match({ id: req.params.id, user_id: req.user.id })
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update public status' });
  }
});

// Delete all history for user
router.delete('/all', async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('query_history')
      .delete()
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete all history items' });
  }
});

// Delete a history item
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('query_history')
      .delete()
      .match({ id: req.params.id, user_id: req.user.id });

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete history item' });
  }
});

module.exports = router;
