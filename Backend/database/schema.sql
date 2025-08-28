-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Places table
CREATE TABLE IF NOT EXISTS public.places (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT,
  image_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  price_range TEXT DEFAULT 'budget',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trips table
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'planning',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trip places junction table
CREATE TABLE IF NOT EXISTS public.trip_places (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  place_id UUID REFERENCES public.places(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trip_id, place_id)
);

-- User preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  preferred_categories TEXT[] DEFAULT '{}',
  budget_range TEXT DEFAULT 'medium',
  travel_style TEXT DEFAULT 'balanced',
  preferred_countries TEXT[] DEFAULT '{}',
  notification_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User favorites table
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  place_id UUID REFERENCES public.places(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, place_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  place_id UUID REFERENCES public.places(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, place_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_places_category ON public.places(category);
CREATE INDEX IF NOT EXISTS idx_places_country ON public.places(country);
CREATE INDEX IF NOT EXISTS idx_places_rating ON public.places(rating);
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_dates ON public.trips(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_trip_places_trip_id ON public.trip_places(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_places_place_id ON public.trip_places(place_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_place_id ON public.reviews(place_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);

-- -- Enable Row Level Security (RLS)
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.trip_places ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- -- -- RLS Policies

-- -- Profiles: Users can only see and edit their own profile
-- CREATE POLICY "Users can view own profile" ON public.profiles
--   FOR SELECT USING (auth.uid() = id);

-- CREATE POLICY "Users can update own profile" ON public.profiles
--   FOR UPDATE USING (auth.uid() = id);

-- CREATE POLICY "Users can insert own profile" ON public.profiles
--   FOR INSERT WITH CHECK (auth.uid() = id);

-- -- Places: Public read access, authenticated users can create/edit their own
-- CREATE POLICY "Anyone can view places" ON public.places
--   FOR SELECT USING (true);

-- CREATE POLICY "Authenticated users can create places" ON public.places
--   FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- CREATE POLICY "Users can update own places" ON public.places
--   FOR UPDATE USING (auth.uid() = created_by);

-- CREATE POLICY "Users can delete own places" ON public.places
--   FOR DELETE USING (auth.uid() = created_by);

-- -- Trips: Users can only see and edit their own trips
-- CREATE POLICY "Users can view own trips" ON public.trips
--   FOR SELECT USING (auth.uid() = user_id);

-- CREATE POLICY "Users can create own trips" ON public.trips
--   FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can update own trips" ON public.trips
--   FOR UPDATE USING (auth.uid() = user_id);

-- CREATE POLICY "Users can delete own trips" ON public.trips
--   FOR DELETE USING (auth.uid() = user_id);

-- -- Trip places: Users can only see and edit their own trip places
-- CREATE POLICY "Users can view own trip places" ON public.trip_places
--   FOR SELECT USING (
--     EXISTS (
--       SELECT 1 FROM public.trips 
--       WHERE trips.id = trip_places.trip_id 
--       AND trips.user_id = auth.uid()
--     )
--   );

-- CREATE POLICY "Users can manage own trip places" ON public.trip_places
--   FOR ALL USING (
--     EXISTS (
--       SELECT 1 FROM public.trips 
--       WHERE trips.id = trip_places.trip_id 
--       AND trips.user_id = auth.uid()
--     )
--   );

-- -- User preferences: Users can only see and edit their own preferences
-- CREATE POLICY "Users can view own preferences" ON public.user_preferences
--   FOR SELECT USING (auth.uid() = user_id);

-- CREATE POLICY "Users can manage own preferences" ON public.user_preferences
--   FOR ALL USING (auth.uid() = user_id);

-- -- User favorites: Users can only see and edit their own favorites
-- CREATE POLICY "Users can view own favorites" ON public.user_favorites
--   FOR SELECT USING (auth.uid() = user_id);

-- CREATE POLICY "Users can manage own favorites" ON public.user_favorites
--   FOR ALL USING (auth.uid() = user_id);

-- -- Reviews: Public read access, authenticated users can create/edit their own
-- CREATE POLICY "Anyone can view reviews" ON public.reviews
--   FOR SELECT USING (true);

-- CREATE POLICY "Authenticated users can create reviews" ON public.reviews
--   FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- CREATE POLICY "Users can update own reviews" ON public.reviews
--   FOR UPDATE USING (auth.uid() = user_id);

-- CREATE POLICY "Users can delete own reviews" ON public.reviews
--   FOR DELETE USING (auth.uid() = user_id);

-- -- Functions and triggers for updated_at
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.updated_at = NOW();
--   RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- -- Create triggers for updated_at
-- CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
--   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_places_updated_at BEFORE UPDATE ON public.places
--   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips
--   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
--   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
