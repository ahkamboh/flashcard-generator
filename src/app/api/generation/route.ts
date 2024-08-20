import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '', // Use environment variable
  dangerouslyAllowBrowser: true,
});

interface Flashcard {
  question: string;
  answer: string;
  isFlipped: boolean;
}

export async function POST(req: NextRequest) {
  try {
    // Log the entire request for debugging
    const requestData = await req.text(); 
    console.log("Raw request data:", requestData);
    
    const { input } = JSON.parse(requestData) as { input: string };
    
    console.log("Parsed input:", input); // Log the parsed input

    if (!input || typeof input !== 'string') {
      console.error('Invalid input format or missing input');
      return NextResponse.json({ error: 'Invalid input format or missing input' }, { status: 400 });
    }

    const generateFlashcardsForTopic = async (topic: string): Promise<Flashcard[]> => {
      try {
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
        const newFlashcards = lines.map(line => {
          const [question, answer] = line.split(' - ').map(part => part.trim());
          return { question, answer, isFlipped: false };
        });

        return newFlashcards;
      } catch (error) {
        console.error('Error generating flashcards:', error);
        return [{ question: "Error", answer: "Couldn't generate flashcards.", isFlipped: false }];
      }
    };

    if (input.toLowerCase().startsWith('flashcards for ')) {
      const topic = input.slice(15).trim();
      const flashcards = await generateFlashcardsForTopic(topic);
      return NextResponse.json(flashcards, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid input format' }, { status: 400 });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
