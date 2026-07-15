import { useApp } from '../../context/AppContext';

export function RoleSwitcher() {
  const { currentRole, setRole } = useApp();
  const roles = [
    { id: 'student' as const, label: '👩‍🎓 Student' },
    { id: 'tutor' as const, label: '👨‍🏫 Tutor' },
    { id: 'parent' as const, label: '👨‍👧 Parent' },
    { id: 'admin' as const, label: '⚙️ Admin' },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-1 flex gap-1">
      {roles.map((role) => (
        <button
          key={role.id}
          onClick={() => setRole(role.id)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            currentRole === role.id
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {role.label}
        </button>
      ))}
    </div>
  );
}
