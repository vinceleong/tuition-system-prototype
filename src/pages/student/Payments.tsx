import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog } from '../../components/ui/dialog';
import { EmptyState } from '../../components/shared/shared';
import {
  CreditCard, Plus, ArrowUpRight, ArrowDownRight,
  Wallet, History,
} from 'lucide-react';

export function StudentPayments() {
  const { getPayments, getWalletBalance, currentUserId, addPayment } = useApp();

  const payments = getPayments();
  const balance = getWalletBalance();

  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) return;

    const newPayment = {
      id: `pay-${Date.now()}`,
      userId: currentUserId,
      tutorId: '',
      amount,
      type: 'wallet_topup' as const,
      status: 'completed' as const,
      date: new Date().toISOString().split('T')[0],
      description: 'Wallet top-up',
    };
    addPayment(newPayment);
    setShowTopUp(false);
    setTopUpAmount('');
    setTopUpSuccess(true);
    setTimeout(() => setTopUpSuccess(false), 3000);
  };

  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const now = new Date();
  const thisMonthSpent = payments
    .filter((p) => {
      const payDate = new Date(p.date);
      return (
        p.type === 'session_payment' &&
        p.status === 'completed' &&
        payDate.getMonth() === now.getMonth() &&
        payDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, p) => sum + p.amount, 0);

  const typeBadgeVariant = (type: string) => {
    switch (type) {
      case 'session_payment': return 'info' as const;
      case 'wallet_topup': return 'success' as const;
      case 'refund': return 'warning' as const;
      case 'payout': return 'default' as const;
      default: return 'default' as const;
    }
  };

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success' as const;
      case 'pending': return 'warning' as const;
      case 'failed': return 'danger' as const;
      default: return 'default' as const;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-500 mt-1">Manage your wallet and view transactions.</p>
      </div>

      {/* Top-up success */}
      {topUpSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
          Wallet topped up successfully!
        </div>
      )}

      {/* Wallet Balance Card */}
      <Card className="bg-gradient-to-br from-primary-600 to-primary-800 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Wallet size={20} />
                <p className="text-sm text-primary-100">Wallet Balance</p>
              </div>
              <p className="text-4xl font-bold">{formatCurrency(balance)}</p>
              <p className="text-sm text-primary-200 mt-2">
                Spent this month: {formatCurrency(thisMonthSpent)}
              </p>
            </div>
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary-700 hover:bg-primary-50"
              onClick={() => setShowTopUp(true)}
            >
              <Plus size={18} className="mr-2" />
              Top Up
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History size={18} className="text-primary-600" />
            <h2 className="font-semibold text-gray-900">Transaction History</h2>
          </div>
        </CardHeader>
        <CardContent>
          {sortedPayments.length === 0 ? (
            <EmptyState
              icon="💳"
              title="No transactions"
              description="Your payment history will appear here."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPayments.map((payment) => {
                    const isDebit = payment.type === 'session_payment';
                    return (
                      <tr key={payment.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-2 text-sm text-gray-500">
                          {formatDate(payment.date)}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-900">
                          {payment.description}
                        </td>
                        <td className="py-3 px-2 text-sm">
                          <span className={`flex items-center gap-1 font-medium ${
                            isDebit ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {isDebit ? (
                              <ArrowDownRight size={14} />
                            ) : (
                              <ArrowUpRight size={14} />
                            )}
                            {isDebit ? '-' : '+'}{formatCurrency(payment.amount)}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant={typeBadgeVariant(payment.type)}>
                            {payment.type.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant={statusBadgeVariant(payment.status)}>
                            {payment.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Up Dialog */}
      <Dialog open={showTopUp} onClose={() => setShowTopUp(false)} title="Top Up Wallet">
        <div className="space-y-4">
          <Input
            label="Amount (USD)"
            type="number"
            placeholder="Enter amount..."
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            min="1"
          />
          {topUpAmount && parseFloat(topUpAmount) > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="text-gray-500">You are adding:</p>
              <p className="text-2xl font-bold text-primary-700">{formatCurrency(parseFloat(topUpAmount))}</p>
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowTopUp(false)}>Cancel</Button>
            <Button onClick={handleTopUp} disabled={!topUpAmount || parseFloat(topUpAmount) <= 0}>
              <CreditCard size={16} className="mr-2" />
              Pay {topUpAmount ? formatCurrency(parseFloat(topUpAmount)) : ''}
            </Button>
          </div>
          <p className="text-xs text-gray-400 text-center">
            This is a simulated payment. No real transaction will occur.
          </p>
        </div>
      </Dialog>
    </div>
  );
}
