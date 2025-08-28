const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Get user's trips
router.get('/', authenticateUser, async (req, res) => {
  try {
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
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ trips: data });
  } catch (error) {
    console.error('Trips fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// Get trip by ID
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        places: trip_places(
          place_id,
          places(*)
        )
      `)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json({ trip: data });
  } catch (error) {
    console.error('Trip fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

// Create new trip
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { title, description, start_date, end_date, budget, places } = req.body;
    
    if (!title || !start_date || !end_date) {
      return res.status(400).json({ error: 'Title, start date, and end date are required' });
    }

    // Create trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .insert({
        title,
        description,
        start_date,
        end_date,
        budget: budget || 0,
        user_id: req.user.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (tripError) {
      return res.status(400).json({ error: tripError.message });
    }

    // Add places to trip if provided
    if (places && places.length > 0) {
      const tripPlaces = places.map(placeId => ({
        trip_id: trip.id,
        place_id: placeId,
        added_at: new Date().toISOString()
      }));

      const { error: placesError } = await supabase
        .from('trip_places')
        .insert(tripPlaces);

      if (placesError) {
        console.error('Error adding places to trip:', placesError);
      }
    }

    res.status(201).json({
      message: 'Trip created successfully',
      trip
    });
  } catch (error) {
    console.error('Trip creation error:', error);
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// Update trip
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if user owns the trip
    const { data: existingTrip, error: fetchError } = await supabase
      .from('trips')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (existingTrip.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this trip' });
    }

    const { data, error } = await supabase
      .from('trips')
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
      message: 'Trip updated successfully',
      trip: data
    });
  } catch (error) {
    console.error('Trip update error:', error);
    res.status(500).json({ error: 'Failed to update trip' });
  }
});

// Delete trip
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user owns the trip
    const { data: existingTrip, error: fetchError } = await supabase
      .from('trips')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (existingTrip.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this trip' });
    }

    // Delete trip places first
    await supabase
      .from('trip_places')
      .delete()
      .eq('trip_id', id);

    // Delete trip
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Trip deletion error:', error);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

// Add place to trip
router.post('/:id/places', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { place_id } = req.body;
    
    if (!place_id) {
      return res.status(400).json({ error: 'Place ID is required' });
    }

    // Check if user owns the trip
    const { data: existingTrip, error: fetchError } = await supabase
      .from('trips')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (existingTrip.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to modify this trip' });
    }

    const { data, error } = await supabase
      .from('trip_places')
      .insert({
        trip_id: id,
        place_id,
        added_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: 'Place added to trip successfully',
      tripPlace: data
    });
  } catch (error) {
    console.error('Add place to trip error:', error);
    res.status(500).json({ error: 'Failed to add place to trip' });
  }
});

// Remove place from trip
router.delete('/:id/places/:placeId', authenticateUser, async (req, res) => {
  try {
    const { id, placeId } = req.params;
    
    // Check if user owns the trip
    const { data: existingTrip, error: fetchError } = await supabase
      .from('trips')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (existingTrip.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to modify this trip' });
    }

    const { error } = await supabase
      .from('trip_places')
      .delete()
      .eq('trip_id', id)
      .eq('place_id', placeId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Place removed from trip successfully' });
  } catch (error) {
    console.error('Remove place from trip error:', error);
    res.status(500).json({ error: 'Failed to remove place from trip' });
  }
});

module.exports = router;
