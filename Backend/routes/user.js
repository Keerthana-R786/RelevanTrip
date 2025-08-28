const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Get user preferences
router.get('/preferences', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return res.status(400).json({ error: error.message });
    }

    res.json({ preferences: data || {} });
  } catch (error) {
    console.error('Preferences fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

// Update user preferences
router.put('/preferences', authenticateUser, async (req, res) => {
  try {
    const { 
      preferred_categories, 
      budget_range, 
      travel_style, 
      preferred_countries,
      notification_settings 
    } = req.body;

    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: req.user.id,
        preferred_categories: preferred_categories || [],
        budget_range: budget_range || 'medium',
        travel_style: travel_style || 'balanced',
        preferred_countries: preferred_countries || [],
        notification_settings: notification_settings || {},
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: 'Preferences updated successfully',
      preferences: data
    });
  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Get user statistics
router.get('/stats', authenticateUser, async (req, res) => {
  try {
    // Get trip count
    const { count: tripCount, error: tripError } = await supabase
      .from('trips')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    if (tripError) {
      console.error('Trip count error:', tripError);
    }

    // Get visited places count
    const { count: placesCount, error: placesError } = await supabase
      .from('trip_places')
      .select('*', { count: 'exact', head: true })
      .eq('trips.user_id', req.user.id);

    if (placesError) {
      console.error('Places count error:', placesError);
    }

    // Get favorite categories
    const { data: categoryStats, error: categoryError } = await supabase
      .from('trip_places')
      .select(`
        places(category)
      `)
      .eq('trips.user_id', req.user.id);

    if (categoryError) {
      console.error('Category stats error:', categoryError);
    }

    // Count categories
    const categoryCounts = {};
    if (categoryStats) {
      categoryStats.forEach(item => {
        if (item.places && item.places.category) {
          categoryCounts[item.places.category] = (categoryCounts[item.places.category] || 0) + 1;
        }
      });
    }

    res.json({
      stats: {
        totalTrips: tripCount || 0,
        totalPlaces: placesCount || 0,
        favoriteCategories: categoryCounts,
        memberSince: req.user.created_at
      }
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

// Get user's favorite places
router.get('/favorites', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        *,
        places(*)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ favorites: data });
  } catch (error) {
    console.error('Favorites fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add place to favorites
router.post('/favorites', authenticateUser, async (req, res) => {
  try {
    const { place_id } = req.body;
    
    if (!place_id) {
      return res.status(400).json({ error: 'Place ID is required' });
    }

    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: req.user.id,
        place_id,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: 'Place added to favorites successfully',
      favorite: data
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ error: 'Failed to add place to favorites' });
  }
});

// Remove place from favorites
router.delete('/favorites/:placeId', authenticateUser, async (req, res) => {
  try {
    const { placeId } = req.params;
    
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', req.user.id)
      .eq('place_id', placeId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Place removed from favorites successfully' });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ error: 'Failed to remove place from favorites' });
  }
});

// Get user's travel history
router.get('/history', authenticateUser, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        places: trip_places(
          place_id,
          places(*)
        )
      `)
      .eq('user_id', req.user.id)
      .order('start_date', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ history: data });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch travel history' });
  }
});

module.exports = router;
