"use client";
import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import Spline from '@splinetool/react-spline';
import Groq from 'groq-sdk';

interface Flashcard {
  question: string;
  answer: string;
  isFlipped: boolean;
}

const groq = new Groq({ 
  apiKey: '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', // Replace with your actual API key
  dangerouslyAllowBrowser: true 
});

const FrontComponent: React.FC<{ onClick: () => void; question: string }> = ({ onClick, question }) => (
  <div 
    className="sm:w-96 w-60 h-64 bg-glassy flex items-center justify-center text-center text-white text-lg font-bold rounded-lg shadow-lg cursor-pointer" 
    onClick={onClick}
  >
    {question}
  </div>
);

const BackComponent: React.FC<{ onClick: () => void; answer: string }> = ({ onClick, answer }) => (
  <div 
    className="sm:w-96 w-60 h-64 bg-glassy flex items-center justify-center text-center text-white text-lg font-bold rounded-lg shadow-lg cursor-pointer" 
    onClick={onClick}
  >
    {answer}
  </div>
);

const App: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [input, setInput] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input) return;

    setIsLoading(true);

    if (input.toLowerCase().startsWith('flashcards for ')) {
      const topic = input.slice(15).trim();
      await generateFlashcardsForTopic(topic);
    } else {
      await processUserInput();
    }

    setInput('');
    setIsLoading(false);
  };

  const generateFlashcardsForTopic = async (topic: string) => {
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

      setFlashcards(newFlashcards);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      setFlashcards([{ question: "Error", answer: "Couldn't generate flashcards.", isFlipped: false }]);
    }
  };

  const processUserInput = async () => {
    const lines = input.split('\n').filter(line => line.trim() !== '');
    const newFlashcards: Flashcard[] = [];

    for (const line of lines) {
      let question, answer;
      if (line.includes(' - ')) {
        [question, answer] = line.split(' - ').map(part => part.trim());
      } else {
        question = line.trim();
        answer = await getAIAnswer(question);
      }
      newFlashcards.push({ question, answer, isFlipped: false });
    }

    setFlashcards(newFlashcards);
    setCurrentIndex(0);
  };

  const getAIAnswer = async (question: string): Promise<string> => {
    try {
      const response = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant that provides concise answers to questions." },
          { role: "user", content: `Please provide a concise answer to the following question: ${question}` }
        ],
        model: "llama3-8b-8192",
        max_tokens: 100
      });
      return response.choices[0]?.message?.content || "Sorry, I couldn't generate an answer.";
    } catch (error) {
      console.error('Error fetching AI answer:', error);
      return "Error: Couldn't generate an answer.";
    }
  };

  const handleFlip = () => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[currentIndex].isFlipped = !updatedFlashcards[currentIndex].isFlipped;
    setFlashcards(updatedFlashcards);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="relative p-4 card-bg h-screen">
      <div className="absolute top-[50%] w-full left-[50%] -translate-x-1/2 -translate-y-1/2 h-full">
        <Spline
          scene="https://prod.spline.design/Cd695Ckh0GnuY2jh/scene.splinecode"
        />
      </div>
      <form onSubmit={handleInputSubmit} className="mb-4 relative z-10">
        <textarea 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Enter questions or 'Question - Answer' pairs (one per line)" 
          className="w-full h-24 p-2 border text-black border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          className="mt-2 px-4 py-2 gradient-border-button2 text-white font-semibold rounded-lg duration-200"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Flashcards'}
        </button>
      </form>
      {flashcards.length > 0 ? (
        <div className="flex flex-col items-center relative z-10">
          <ReactCardFlip isFlipped={flashcards[currentIndex].isFlipped}>
            <FrontComponent onClick={handleFlip} question={flashcards[currentIndex].question} />
            <BackComponent onClick={handleFlip} answer={flashcards[currentIndex].answer} />
          </ReactCardFlip>
          <div className="flex justify-between w-full mt-4">
            <button 
              onClick={handleBack} 
              disabled={currentIndex === 0} 
              className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition duration-200 disabled:opacity-50"
            >
              Back
            </button>
            <button 
              onClick={handleNext} 
              disabled={currentIndex === flashcards.length - 1} 
              className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition duration-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64 relative z-10">
          <p className="text-gray-500 text-lg">No flashcards available</p>
        </div>
      )}
    </div>
  );
};

export default App;
