import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { StatCard } from '../../components/shared/shared';
import { Input } from '../../components/ui/input';
import { DollarSign, TrendingUp, Clock, Check, X } from 'lucide-react';
import { getUserById } from '../../data/users';
import { formatCurrency, formatDate } from '../../lib/utils';

export function AdminPayments() {
  const { payments, users } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const thisWeek = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  })();

  const completedPayments = payments.filter(p => p.status === 'completed');
  const todayRevenue = completedPayments.filter(p => p.type === 'session_payment' && p.date === today).reduce((s, p) => s + p.amount, 0);
  const weekRevenue = completedPayments.filter(p => p.type === 'session_payment' && p.date >= thisWeek).reduce((s, p) => s + p.amount, 0);
  const monthRevenue = completedPayments.filter(p => p.type === 'session_payment' && new Date(p.date + 'T00:00:00').getMonth() === new Date().getMonth()).reduce((s, p) => s + p.amount, 0);
  const totalRevenue = completedPayments.filter(p => p.type === 'session_payment').reduce((s, p) => s + p.amount, 0);

  const pendingRefunds = payments.filter(p => p.type === 'refund' && p.status === 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Overview</h1>
        <p className="text-gray-500 mt-1">Platform revenue and transactions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard label="Today's Revenue" value={formatCurrency(todayRevenue)} icon={<DollarSign size={20} />} />
        <StatCard label="This Week" value={formatCurrency(weekRevenue)} icon={<TrendingUp size={20} />} trend="up" />
        <StatCard label="This Month" value={formatCurrency(monthRevenue)} icon={<Clock size={20} />} />
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} icon={<DollarSign size={20} />} />
      </div>

      <Card>
        <CardHeader><h3 className="font-semibold text-gray-900">Transactions</h3></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 text-xs font-medium text-gray-500">ID</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">From</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">To</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Amount</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => {
                const fromUser = getUserById(p.userId);
                const toUser = p.tutorId ? getUserById(p.tutorId) : null;
                return (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500 font-mono">{p.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{fromUser?.name || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{toUser?.name || '-'}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(p.amount)}</td>
                    <td className="px-4 py-3"><Badge variant={p.type === 'session_payment' ? 'info' : p.type === 'wallet_topup' ? 'success' : p.type === 'refund' ? 'warning' : 'default'}>{p.type.replace('_', ' ')}</Badge></td>
                    <td className="px-4 py-3"><Badge variant={p.status === 'completed' ? 'success' : p.status === 'pending' ? 'warning' : 'danger'}>{p.status}</Badge></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(p.date)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {pendingRefunds.length > 0 && (
        <Card>
          <CardHeader><h3 className="font-semibold text-gray-900">Pending Refunds</h3></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingRefunds.map(r => {
                const user = getUserById(r.userId);
                return (
                  <div key={r.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{r.description}</p>
                      <p className="text-xs text-gray-500">{user?.name} · {formatDate(r.date)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">{formatCurrency(r.amount)}</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="text-green-600 border-green-300"><Check size={14} /> Approve</Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-300"><X size={14} /> Reject</Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
