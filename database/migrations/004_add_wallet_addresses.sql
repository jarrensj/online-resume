-- Add wallet address fields to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN evm_wallet_address TEXT,
ADD COLUMN solana_wallet_address TEXT;

-- Update the public_user_profiles view to include wallet addresses
CREATE OR REPLACE VIEW public_user_profiles AS
SELECT 
    id,
    username,
    created_at,
    linkedin,
    twitter_handle,
    ig_handle,
    website,
    evm_wallet_address,
    solana_wallet_address
FROM user_profiles;

-- Refresh grants on the updated view
GRANT SELECT ON public_user_profiles TO authenticated;
