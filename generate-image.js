import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { prompt } = req.body;

  try {
    const response = await openai.images.generate({
      prompt: `Crie uma imagem educacional sobre: ${prompt}`,
      n: 1,
      size: '1024x1024'
    });

    return res.status(200).json({ url: response.data[0].url });
  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    return res.status(500).json({ error: 'Falha ao gerar imagem' });
  }
}