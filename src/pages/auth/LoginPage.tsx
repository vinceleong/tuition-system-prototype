import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/button';
import { GraduationCap } from 'lucide-react';

export function LoginPage() {
  const { setRole } = useApp();
  const navigate = useNavigate();

  const handleLogin = (role: 'student' | 'tutor' | 'parent' | 'admin') => {
    setRole(role);
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">TuitionHub</h1>
          <p className="text-gray-500 mt-1">Select your role to continue</p>
        </div>
        <div className="space-y-3">
          {[
            { role: 'student' as const, label: 'Student', desc: 'Find tutors, book sessions, track progress', icon: '👩‍🎓', color: 'hover:bg-blue-50 hover:border-blue-300' },
            { role: 'tutor' as const, label: 'Tutor', desc: 'Manage schedule, teach students, track earnings', icon: '👨‍🏫', color: 'hover:bg-green-50 hover:border-green-300' },
            { role: 'parent' as const, label: 'Parent', desc: 'Monitor your child\'s learning journey', icon: '👨‍👧', color: 'hover:bg-purple-50 hover:border-purple-300' },
            { role: 'admin' as const, label: 'Admin', desc: 'Platform management and oversight', icon: '⚙️', color: 'hover:bg-orange-50 hover:border-orange-300' },
          ].map((item) => (
            <button
              key={item.role}
              onClick={() => handleLogin(item.role)}
              className={`w-full text-left p-4 rounded-xl border-2 border-gray-100 transition-all ${item.color} group`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
