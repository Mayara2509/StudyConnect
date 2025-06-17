import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function AdminPanel() {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [activitiesSnap, usersSnap] = await Promise.all([
        getDocs(collection(db, 'activities')),
        getDocs(collection(db, 'users'))
      ]);
      
      setActivities(activitiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold mb-2">Atividades Recentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activities.map(activity => (
            <div key={activity.id} className="border p-3 rounded-lg">
              <p><strong>Usuário:</strong> {activity.userName}</p>
              <p><strong>Data:</strong> {new Date(activity.createdAt?.toDate()).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Usuários Registrados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Nome</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Cursos</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td className="py-2 px-4 border">{user.displayName}</td>
                  <td className="py-2 px-4 border">{user.email}</td>
                  <td className="py-2 px-4 border">{user.courses?.join(', ') || 'Nenhum'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}