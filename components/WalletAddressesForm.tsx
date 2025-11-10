'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

type WalletFieldKey = 'evm_wallet_address' | 'solana_wallet_address'

type WalletAddressesState = Record<WalletFieldKey, string>

interface WalletAddressesFormProps {
  onWalletsUpdated?: (wallets: WalletAddressesState) => void
}

const defaultState: WalletAddressesState = {
  evm_wallet_address: '',
  solana_wallet_address: '',
}

export default function WalletAddressesForm({ onWalletsUpdated }: WalletAddressesFormProps) {
  const [wallets, setWallets] = useState<WalletAddressesState>({ ...defaultState })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const hasAnyValue = Object.values(wallets).some((value) => value.trim().length > 0)

  useEffect(() => {
    const fetchWallets = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch('/api/wallets')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load wallet addresses')
        }

        if (data.wallets) {
          setWallets({
            evm_wallet_address: data.wallets.evm_wallet_address ?? '',
            solana_wallet_address: data.wallets.solana_wallet_address ?? '',
          })
        }
      } catch (err) {
        console.error('Error fetching wallet addresses:', err)
        setError(err instanceof Error ? err.message : 'An error occurred while loading wallet addresses')
      } finally {
        setLoading(false)
      }
    }

    fetchWallets()
  }, [])

  const handleChange = (field: WalletFieldKey) => (event: ChangeEvent<HTMLInputElement>) => {
    setWallets((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
    setSuccess('')
    setError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setSubmitting(true)
    setError('')
    setSuccess('')

    const payload = (Object.keys(wallets) as WalletFieldKey[]).reduce<Record<string, string>>((acc, key) => {
      acc[key] = wallets[key].trim()
      return acc
    }, {})

    try {
      const response = await fetch('/api/wallets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update wallet addresses')
      }

      const updatedWallets: WalletAddressesState = {
        evm_wallet_address: data.wallets.evm_wallet_address ?? '',
        solana_wallet_address: data.wallets.solana_wallet_address ?? '',
      }

      setWallets(updatedWallets)
      setSuccess('Wallet addresses updated successfully!')
      onWalletsUpdated?.(updatedWallets)
    } catch (err) {
      console.error('Error updating wallet addresses:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while updating wallet addresses')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto card p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 heading-handwritten">
          Wallet Addresses
        </h2>
        <p className="text-secondary">
          Add your cryptocurrency wallet addresses
        </p>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 mx-auto loading-spinner"></div>
          <p className="mt-4 text-sm loading-text">
            Loading wallet addresses…
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="evm_wallet_address" className="form-label">
              EVM Wallet Address
            </label>
            <input
              type="text"
              id="evm_wallet_address"
              value={wallets.evm_wallet_address}
              onChange={handleChange('evm_wallet_address')}
              placeholder="0x…"
              className="input-field font-mono text-sm"
              disabled={submitting}
            />
            <p className="mt-1 text-xs text-secondary">
              Ethereum, Polygon, BSC, and other EVM-compatible chains
            </p>
          </div>

          <div>
            <label htmlFor="solana_wallet_address" className="form-label">
              Solana Wallet Address
            </label>
            <input
              type="text"
              id="solana_wallet_address"
              value={wallets.solana_wallet_address}
              onChange={handleChange('solana_wallet_address')}
              placeholder="Enter your Solana wallet address"
              className="input-field font-mono text-sm"
              disabled={submitting}
            />
            <p className="mt-1 text-xs text-secondary">
              Your Solana (SOL) wallet address
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          <div className="flex justify-between items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 btn-base btn-primary"
            >
              {submitting ? 'Saving…' : 'Save Wallet Addresses'}
            </button>
            <button
              type="button"
              onClick={() => {
                setWallets({ ...defaultState })
                setSuccess('')
                setError('')
              }}
              disabled={submitting || !hasAnyValue}
              className="btn-base btn-outline"
            >
              Clear
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
