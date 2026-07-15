import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { BarChart, StatCard } from '../../components/shared/shared';
import { Button } from '../../components/ui/button';
import { DollarSign, TrendingUp, Clock, CreditCard } from 'lucide-react';
import { getUserById } from '../../data/users';
import { formatCurrency, formatDate } from '../../lib/utils';

export function TutorEarnings() {
  const { currentUser, payments } = useApp();
  const myEarnings = payments.filter(p => p.tutorId === currentUser.id && p.type === 'session_payment' && p.status === 'completed');
  const total = myEarnings.reduce((s, p) => s + p.amount, 0);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const thisMonth = new Date().getMonth();
  const monthData = months.map((label, i) => {
    const amount = myEarnings.filter(p => new Date(p.date + 'T00:00:00').getMonth() === i).reduce((s, p) => s + p.amount, 0);
    return { label, value: amount, color: i === thisMonth ? 'bg-primary-500' : 'bg-primary-200' };
  });

  const monthTotal = monthData[thisMonth]?.value || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-500 mt-1">Track your tutoring income</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Earnings" value={formatCurrency(total)} icon={<DollarSign size={20} />} trend="up" />
        <StatCard label="This Month" value={formatCurrency(monthTotal)} icon={<TrendingUp size={20} />} />
        <StatCard label="Pending Payout" value={formatCurrency(0)} icon={<Clock size={20} />} subtext="No pending payouts" />
      </div>

      <Card>
        <CardHeader><h3 className="font-semibold text-gray-900">Earnings by Month</h3></CardHeader>
        <CardContent><BarChart data={monthData} /></CardContent>
      </Card>

      <Card>
        <CardHeader><h3 className="font-semibold text-gray-900">Transaction History</h3></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {myEarnings.map(p => {
              const student = p.userId ? getUserById(p.userId) : null;
              return (
                <div key={p.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{p.description}</p>
                    <p className="text-xs text-gray-500">{student?.name || 'Student'} · {formatDate(p.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">+{formatCurrency(p.amount)}</p>
                    <Badge variant="success">{p.status}</Badge>
                  </div>
                </div>
              );
            })}
            {myEarnings.length === 0 && (
              <p className="text-sm text-gray-500 py-4 text-center">No transactions yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button><DollarSign size={16} className="mr-1" /> Request Payout</Button>
      </div>
    </div>
  );
}
