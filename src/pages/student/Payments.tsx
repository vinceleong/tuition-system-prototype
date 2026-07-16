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
  CreditCard, ArrowUpRight, ArrowDownRight,
  FileText, History, CheckCircle, AlertCircle,
} from 'lucide-react';

export function StudentPayments() {
  const { getPayments, getOutstandingBalance, getMonthlyBills, currentUserId, addPayment } = useApp();

  const payments = getPayments();
  const outstandingBalance = getOutstandingBalance();
  const monthlyBills = getMonthlyBills();

  const [showPayDialog, setShowPayDialog] = useState(false);
  const [selectedBill, setSelectedBill] = useState<{ label: string; year: number; month: number; balance: number } | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [paySuccess, setPaySuccess] = useState(false);

  const openPayDialog = (bill: { year: number; month: number; label: string; balance: number }) => {
    setSelectedBill(bill);
    setPayAmount(bill.balance.toString());
    setShowPayDialog(true);
  };

  const handlePayBill = () => {
    if (!selectedBill) return;
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) return;

    const newPayment = {
      id: `pay-${Date.now()}`,
      userId: currentUserId,
      tutorId: '',
      amount,
      type: 'bill_payment' as const,
      status: 'completed' as const,
      date: new Date().toISOString().split('T')[0],
      description: `${selectedBill.label} bill payment`,
    };
    addPayment(newPayment);
    setShowPayDialog(false);
    setSelectedBill(null);
    setPayAmount('');
    setPaySuccess(true);
    setTimeout(() => setPaySuccess(false), 3000);
  };

  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const typeBadgeVariant = (type: string) => {
    switch (type) {
      case 'session_payment': return 'info' as const;
      case 'bill_payment': return 'success' as const;
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
        <h1 className="text-2xl font-bold text-gray-900">Payments &amp; Billing</h1>
        <p className="text-gray-500 mt-1">View your monthly bills and pay directly.</p>
      </div>

      {/* Payment success */}
      {paySuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
          Bill paid successfully!
        </div>
      )}

      {/* Outstanding Balance Card */}
      <Card className="bg-gradient-to-br from-primary-600 to-primary-800 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText size={20} />
                <p className="text-sm text-primary-100">Outstanding Balance</p>
              </div>
              <p className="text-4xl font-bold">{formatCurrency(outstandingBalance)}</p>
              <p className="text-sm text-primary-200 mt-2">
                {outstandingBalance > 0
                  ? 'You have unpaid session charges. Pay your bill below.'
                  : 'All bills are paid. No outstanding balance.'}
              </p>
            </div>
            {outstandingBalance > 0 && (
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-700 hover:bg-primary-50"
                onClick={() => {
                  const unpaid = monthlyBills.find(b => b.balance > 0);
                  if (unpaid) openPayDialog(unpaid);
                }}
              >
                <CreditCard size={18} className="mr-2" />
                Pay Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Bills */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-primary-600" />
            <h2 className="font-semibold text-gray-900">Monthly Bills</h2>
          </div>
        </CardHeader>
        <CardContent>
          {monthlyBills.length === 0 ? (
            <EmptyState
              icon="📄"
              title="No bills yet"
              description="Your monthly bills will appear here once you have session charges."
            />
          ) : (
            <div className="space-y-3">
              {monthlyBills.map((bill) => (
                <div
                  key={`${bill.year}-${bill.month}`}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      bill.balance > 0 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {bill.balance > 0 ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{bill.label} {bill.year}</p>
                      <p className="text-sm text-gray-500">
                        Charges: {formatCurrency(bill.charges)} · Paid: {formatCurrency(bill.paid)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`font-semibold ${bill.balance > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                        {bill.balance > 0 ? `${formatCurrency(bill.balance)} due` : 'Paid'}
                      </p>
                    </div>
                    {bill.balance > 0 && (
                      <Button
                        size="sm"
                        onClick={() => openPayDialog(bill)}
                      >
                        Pay Bill
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
                    const isCredit = payment.type === 'bill_payment' || payment.type === 'refund';
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
                            isCredit ? 'text-green-600' : isDebit ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {isDebit ? (
                              <ArrowDownRight size={14} />
                            ) : isCredit ? (
                              <ArrowUpRight size={14} />
                            ) : null}
                            {isDebit ? '-' : isCredit ? '+' : ''}{formatCurrency(payment.amount)}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant={typeBadgeVariant(payment.type)}>
                            {payment.type.replace(/_/g, ' ')}
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

      {/* Pay Bill Dialog */}
      <Dialog open={showPayDialog} onClose={() => setShowPayDialog(false)} title="Pay Bill">
        <div className="space-y-4">
          {selectedBill && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="text-gray-500">Paying bill for:</p>
              <p className="text-lg font-bold text-primary-700">
                {selectedBill.label} {selectedBill.year}
              </p>
              <p className="text-gray-500 mt-1">Amount due: {formatCurrency(selectedBill.balance)}</p>
            </div>
          )}
          <Input
            label="Amount (USD)"
            type="number"
            placeholder="Enter amount..."
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            min="1"
          />
          {payAmount && parseFloat(payAmount) > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="text-gray-500">You are paying:</p>
              <p className="text-2xl font-bold text-primary-700">{formatCurrency(parseFloat(payAmount))}</p>
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowPayDialog(false)}>Cancel</Button>
            <Button onClick={handlePayBill} disabled={!payAmount || parseFloat(payAmount) <= 0}>
              <CreditCard size={16} className="mr-2" />
              Pay {payAmount ? formatCurrency(parseFloat(payAmount)) : ''}
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
