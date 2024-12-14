'use client';

import { useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface Currency {
  name: string;
  symbol: string;
  icon: string;
}

interface Network {
  name: string;
  id: string;
}

const currencies: Currency[] = [
  { name: 'Ethereum', symbol: 'ETH', icon: '₿' },
  { name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
  { name: 'Solana', symbol: 'SOL', icon: '◎' },
  { name: 'USD Coin', symbol: 'USDC', icon: '$' },
];

const networks: { [key: string]: Network[] } = {
  ETH: [
    { name: 'Ethereum Mainnet', id: 'eth-main' },
    { name: 'Arbitrum', id: 'arbitrum' },
    { name: 'Optimism', id: 'optimism' },
  ],
  BTC: [
    { name: 'Bitcoin Network', id: 'btc-main' },
    { name: 'Lightning Network', id: 'lightning' },
  ],
  SOL: [
    { name: 'Solana Mainnet', id: 'sol-main' },
  ],
  USDC: [
    { name: 'Ethereum', id: 'usdc-eth' },
    { name: 'Solana', id: 'usdc-sol' },
  ],
};

const walletAddresses: { [key: string]: string } = {
  'eth-main': '0x4BC19c1A02fC1FE1786349884CFb837A1dA015A9',
  'btc-main': 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  'sol-main': '8ZwzXTqxtoxJw7nFqXkypBhsS3QYJAhyRZMsJxVi6j5Q',
};

export default function DonatePage() {
  const [step, setStep] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const handleCurrencySelect = (value: string) => {
    setSelectedCurrency(value);
    setStep(2);
  };

  const handleNetworkSelect = (value: string) => {
    setSelectedNetwork(value);
    setStep(3);
  };

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Support Our Project</h1>
      
      <Card className="w-full">
        <CardContent className="pt-6">
            {step >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-semibold mb-4">Choose currency</h2>
                <Select onValueChange={handleCurrencySelect} value={selectedCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => {
                      return(
                      <SelectItem key={`currency-${currency.symbol}`} value={currency.symbol}>
                        <span className="flex items-center gap-2">
                          <span>{currency.icon}</span>
                          {currency.name} ({currency.symbol})
                        </span>
                      </SelectItem>
                    )})}
                  </SelectContent>
                </Select>
              </motion.div>
            )}

            {step >= 2 && selectedCurrency && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4 mt-6"
              >
                <h2 className="text-xl font-semibold mb-4">Choose network</h2>
                <Select onValueChange={handleNetworkSelect} value={selectedNetwork}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a network" />
                  </SelectTrigger>
                  <SelectContent>
                    {networks[selectedCurrency]?.map((network) => {
                      return (
                      <SelectItem key={`network-${network.id}`} value={network.id}>
                        {network.name}
                      </SelectItem>
                    )})}
                  </SelectContent>
                </Select>
              </motion.div>
            )}

            {step >= 3 && selectedNetwork && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 mt-6"
              >
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-4">Send {selectedCurrency} to this address</h2>
                  <div className="bg-muted p-4 rounded-lg break-all font-mono text-sm">
                    {walletAddresses[selectedNetwork]}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-[200px] h-[200px] bg-muted flex items-center justify-center text-sm text-muted-foreground">
                    QR Code Placeholder
                  </div>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Scan the QR code or copy the address above to make your donation.</p>
                  <p className="mt-2">Thank you for your support!</p>
                </div>
              </motion.div>
            )}
            </CardContent>
      </Card>
    </div>
  );
}