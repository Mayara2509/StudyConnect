import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function ImageGenerator({ userId }) {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      const { url } = await response.json();
      
      // Salva no Firestore
      await addDoc(collection(db, 'generatedImages'), {
        url,
        prompt,
        userId,
        createdAt: serverTimestamp()
      });
      
      setImages(prev => [url, ...prev]);
      setPrompt('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Gerador de Imagens com IA</h2>
      
      <div className="flex gap-2 mb-4">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Descreva a imagem que deseja gerar"
          className="flex-1 border p-2 rounded"
        />
        <button 
          onClick={generateImage}
          disabled={loading}
          className="bg-purple-500 text-white p-2 rounded disabled:bg-gray-400"
        >
          {loading ? 'Gerando...' : 'Gerar'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((img, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <img 
              src={img} 
              alt={`Imagem gerada ${index}`}
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>
    </div>
  );
}