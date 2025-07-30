import React, { useState } from 'react';
import { Volume2, StopCircle } from 'lucide-react';

interface TextToSpeechButtonProps {
  text: string;
}

export function TextToSpeechButton({ text }: TextToSpeechButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleToggleSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <button
      onClick={handleToggleSpeech}
      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      aria-label={isSpeaking ? 'Stop speaking' : 'Read message aloud'}
    >
      {isSpeaking ? (
        <StopCircle className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </button>
  );
}
