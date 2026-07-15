import { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Save } from 'lucide-react';

export function AdminSettings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-500 mt-1">Configure platform parameters and features</p>
      </div>

      <Card>
        <CardHeader><h3 className="font-semibold text-gray-900">General</h3></CardHeader>
        <CardContent className="space-y-4">
          <Input label="Platform Name" defaultValue="TuitionHub" />
          <Input label="Support Email" defaultValue="support@tuitionhub.com" />
          <Input label="Commission Rate (%)" defaultValue="15" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h3 className="font-semibold text-gray-900">Features</h3></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: 'Student Reviews & Ratings', desc: 'Allow students to rate and review tutors after sessions', enabled: true },
              { label: 'In-App Messaging', desc: 'Enable direct messaging between students and tutors', enabled: true },
              { label: 'Session Recording', desc: 'Allow tutors to record sessions for later review', enabled: false },
              { label: 'Virtual Whiteboard', desc: 'Enable collaborative whiteboard during sessions', enabled: true },
            ].map(feature => (
              <div key={feature.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{feature.label}</p>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
                <button
                  className={`relative w-11 h-6 rounded-full transition-colors ${feature.enabled ? 'bg-primary-600' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${feature.enabled ? 'translate-x-5.5 left-0.5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h3 className="font-semibold text-gray-900">Payment Settings</h3></CardHeader>
        <CardContent className="space-y-4">
          <Input label="Minimum Payout Threshold ($)" defaultValue="50" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Accepted Payment Methods</p>
            {['Credit Card', 'PayPal', 'Bank Transfer'].map(method => (
              <label key={method} className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-gray-700">{method}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset Defaults</Button>
        <Button onClick={handleSave}>
          <Save size={16} className="mr-1" /> Save Settings
        </Button>
      </div>

      {saved && (
        <div className="fixed bottom-20 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          ✓ Settings saved successfully!
        </div>
      )}
    </div>
  );
}
