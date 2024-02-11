import React, { useState, useEffect, useRef } from 'react';

const VoiceToFHIRComponent = (props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const speechRecognition = useRef(null);
  const isRecognizing = useRef(false);

  const handleStartRecording = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      speechRecognition.current = new SpeechRecognition();
      speechRecognition.current.continuous = true; // Keep recording
      speechRecognition.current.interimResults = true; // Show results as they are recognized
      speechRecognition.current.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptionPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript((prevTranscript) => prevTranscript + transcriptionPiece);
          } else {
            interimTranscript += transcriptionPiece;
          }
        }
        // Update the component state with the interim transcript
        setTranscript((prevTranscript) => prevTranscript + interimTranscript);
      };
      speechRecognition.current.start();
      isRecognizing.current = true;
      setIsRecording(true);
    } else {
      console.error('Speech recognition API not supported in this browser.');
    }
  };

  const handleStopRecording = () => {
    if (speechRecognition.current && isRecognizing.current) {
      speechRecognition.current.stop();
      speechRecognition.current = null;
      isRecognizing.current = false;
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  useEffect(() => {
    return () => {
      if (isRecording) {
        handleStopRecording();
      }
    };
  }, [isRecording]);

  return (
    <div>
      <div className="flex justify-center">
        <button
          onClick={toggleRecording}
          className={`px-4 py-2 rounded-full text-white ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} disabled:bg-blue-300`}
          aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
        >
          {isRecording ? 'Stop' : 'Start'} Recording
        </button>
      </div>
      <div className="mt-4">
        <p>Transcript: {transcript}</p>
      </div>
    </div>
  );
};

export default VoiceToFHIRComponent;
