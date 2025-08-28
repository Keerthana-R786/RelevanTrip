const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateUser, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all places (public)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, category, country, limit = 20, offset = 0 } = req.query;
    
    let query = supabase
      .from('places')
      .select('*')
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    // Apply filters
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (country) {
      query = query.eq('country', country);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ places: data });
  } catch (error) {
    console.error('Places fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

// Get place by ID (public)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Place not found' });
    }

    res.json({ place: data });
  } catch (error) {
    console.error('Place fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch place' });
  }
});

// Create new place (authenticated users only)
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { name, description, category, country, city, image_url, rating, price_range } = req.body;
    
    if (!name || !description || !category || !country) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('places')
      .insert({
        name,
        description,
        category,
        country,
        city,
        image_url,
        rating: rating || 0,
        price_range: price_range || 'budget',
        created_by: req.user.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'Place created successfully',
      place: data
    });
  } catch (error) {
    console.error('Place creation error:', error);
    res.status(500).json({ error: 'Failed to create place' });
  }
});

// Update place (authenticated users only, creator or admin)
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if user owns the place or is admin
    const { data: existingPlace, error: fetchError } = await supabase
      .from('places')
      .select('created_by')
      .eq('id', id)
      .single();

    if (fetchError) {
      return res.status(404).json({ error: 'Place not found' });
    }

    if (existingPlace.created_by !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this place' });
    }

    const { data, error } = await supabase
      .from('places')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: 'Place updated successfully',
      place: data
    });
  } catch (error) {
    console.error('Place update error:', error);
    res.status(500).json({ error: 'Failed to update place' });
  }
});

// Delete place (authenticated users only, creator or admin)
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user owns the place or is admin
    const { data: existingPlace, error: fetchError } = await supabase
      .from('places')
      .select('created_by')
      .eq('id', id)
      .single();

    if (fetchError) {
      return res.status(404).json({ error: 'Place not found' });
    }

    if (existingPlace.created_by !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this place' });
    }

    const { error } = await supabase
      .from('places')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    console.error('Place deletion error:', error);
    res.status(500).json({ error: 'Failed to delete place' });
  }
});

// Get places by category
router.get('/category/:category', optionalAuth, async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('category', category)
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ places: data });
  } catch (error) {
    console.error('Category places fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch places by category' });
  }
});

module.exports = router;
