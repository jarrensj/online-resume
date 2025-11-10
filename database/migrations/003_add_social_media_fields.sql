-- Add social media fields to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN linkedin TEXT,
ADD COLUMN twitter_handle TEXT,
ADD COLUMN ig_handle TEXT,
ADD COLUMN website TEXT;

-- Update the public_user_profiles view to include new fields
CREATE OR REPLACE VIEW public_user_profiles AS
SELECT 
    id,
    username,
    linkedin,
    twitter_handle,
    ig_handle,
    website,
    created_at
FROM user_profiles;

-- Refresh grants on the updated view
GRANT SELECT ON public_user_profiles TO authenticated;
