import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { messages } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Você é o StudySync+, assistente educacional da plataforma StudyConnect. Seja claro e didático.'
        },
        ...messages
      ],
      temperature: 0.7
    });

    return res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('Erro na API OpenAI:', error);
    return res.status(500).json({ error: 'Erro ao processar sua solicitação' });
  }
}