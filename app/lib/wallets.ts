export type WalletFieldKey = 'evm_wallet_address' | 'solana_wallet_address'

export const WALLET_FIELD_KEYS: WalletFieldKey[] = ['evm_wallet_address', 'solana_wallet_address']

export type SanitizedWalletFields = Partial<Record<WalletFieldKey, string | null>>

export const sanitizeWalletFields = (payload: Record<string, unknown>): SanitizedWalletFields => {
  const result: SanitizedWalletFields = {}

  WALLET_FIELD_KEYS.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      const value = payload[key]

      if (typeof value === 'string') {
        const trimmed = value.trim()
        result[key] = trimmed.length > 0 ? trimmed : null
      } else {
        result[key] = null
      }
    }
  })

  return result
}

export interface WalletFields {
  evm_wallet_address: string | null
  solana_wallet_address: string | null
}

export const emptyWalletFields = (): WalletFields => ({
  evm_wallet_address: null,
  solana_wallet_address: null,
})
