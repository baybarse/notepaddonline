import { createContext, useContext, useState, useCallback } from 'react'

const DonationContext = createContext(null)

const DONATION_URL = 'https://kreosus.com/baybarse/about'

export function DonationProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const openDonation = useCallback(() => setIsOpen(true), [])
  const closeDonation = useCallback(() => setIsOpen(false), [])

  return (
    <DonationContext.Provider value={{ isOpen, openDonation, closeDonation, DONATION_URL }}>
      {children}
    </DonationContext.Provider>
  )
}

export function useDonation() {
  const context = useContext(DonationContext)
  if (!context) throw new Error('useDonation must be used within DonationProvider')
  return context
}
