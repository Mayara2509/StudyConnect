import { useState, useEffect } from 'react';
import { auth, db, storage } from '../Lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Chat } from '../components/Chat';
import { CourseProgress } from '../components/CourseProgress';
import { AdminPanel } from '../components/AdminPanel';
import { ImageGenerator } from '../components/ImageGenerator';

export default function Home() {
  const [user, loadingAuth] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    setIsAdmin(adminDoc.exists());
  };

  if (loadingAuth) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6">StudyConnect+</h1>
        <button 
          onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Entrar com Google
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">StudyConnect+</h1>
        <button 
          onClick={() => auth.signOut()}
          className="px-3 py-1 border rounded"
        >
          Sair
        </button>
      </header>

      <Chat userId={user.uid} />
      <CourseProgress userId={user.uid} />
      <ImageGenerator userId={user.uid} />
      
      {isAdmin && <AdminPanel />}
    </div>
  );
}