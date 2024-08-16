import type { NextApiRequest, NextApiResponse } from 'next';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: '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', // Replace with your actual API key
  dangerouslyAllowBrowser: true
});

type Flashcard = {
  question: string;
  answer: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { topic, input } = req.body;

  try {
    let flashcards: Flashcard[] = [];

    if (topic) {
      // Generate flashcards for a specific topic
      const response = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant that creates flashcards. Generate 10 question-answer pairs about the given topic. Format each pair as 'Question - Answer' on a new line." },
          { role: "user", content: `Create flashcards about ${topic}` }
        ],
        model: "llama3-8b-8192",
        max_tokens: 500
      });

      const content = response.choices[0]?.message?.content || "";
      const lines = content.split('\n').filter(line => line.trim() !== '');
      flashcards = lines.map(line => {
        const [question, answer] = line.split(' - ').map(part => part.trim());
        return { question, answer };
      });

    } else if (input) {
      // Process user input
      const lines = input.split('\n').filter((line: string) => line.trim() !== '');
      for (const line of lines) {
        let question, answer;
        if (line.includes(' - ')) {
          [question, answer] = line.split(' - ').map((part: string) => part.trim());
        } else {
          question = line.trim();
          const response = await groq.chat.completions.create({
            messages: [
              { role: "system", content: "You are a helpful assistant that provides concise answers to questions." },
              { role: "user", content: `Please provide a concise answer to the following question: ${question}` }
            ],
            model: "llama3-8b-8192",
            max_tokens: 100
          });
          answer = response.choices[0]?.message?.content || "Sorry, I couldn't generate an answer.";
        }
        flashcards.push({ question, answer });
      }
    }

    res.status(200).json(flashcards);
  } catch (error) {
    console.error('Error generating flashcards:', error);
    res.status(500).json({ error: "Couldn't generate flashcards." });
  }
}
