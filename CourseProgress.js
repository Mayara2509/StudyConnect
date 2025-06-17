import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import jsPDF from 'jspdf';

export function CourseProgress({ userId }) {
  const [progress, setProgress] = useState({
    completed: false,
    modules: [
      { id: 1, title: "Introdução", completed: true },
      { id: 2, title: "Fundamentos", completed: true },
      { id: 3, title: "Avançado", completed: false }
    ]
  })
};

  useEffect(() => {
    const loadProgress = async () => {
      const docRef = doc(db, 'courseProgress', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProgress(docSnap.data());
      }
    };
    loadProgress();
  }, [userId]);

  const toggleModule = async (moduleId) => {
    const updatedModules = progress.modules.map(module => 
      module.id === moduleId ? { ...module, completed: !module.completed } : module
    );
    
    const allCompleted = updatedModules.every(m => m.completed);
    
    await setDoc(doc(db, 'courseProgress', userId), {
      modules: updatedModules,
      completed: allCompleted
    });
    
    setProgress({
      modules: updatedModules,
      completed: allCompleted
    });
  };

  const generateCertificate = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Certificado de Conclusão", 105, 30, null, null, 'center');
    doc.setFontSize(14);
    doc.text(`Certificamos que ${progress.userName || 'o aluno'} completou com sucesso o curso.`, 105, 50)
  };