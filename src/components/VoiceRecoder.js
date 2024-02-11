import React, { useState, useEffect, useRef } from 'react';

const VoiceToFHIRComponent = (props) => {
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const dataArray = useRef(null);
  const requestRef = useRef(null);
  const canvasRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const toggleRecording = () => {
    isRecording ? stopRecording() : startRecording();
  };
  const draw = () => {
    if (analyser.current) {
      analyser.current.getByteTimeDomainData(dataArray.current);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Clear the canvas to transparent
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, 'rgba(133, 255, 144, 1)');
      gradient.addColorStop(1, 'rgba(53, 162, 235, 1)');

      ctx.lineWidth = 2;
      ctx.strokeStyle = gradient;
      ctx.beginPath();

      let sliceWidth = canvas.width * 1.0 / dataArray.current.length;
      let x = 0;

      for (let i = 0; i < dataArray.current.length; i++) {
        let v = dataArray.current[i] / 128.0;
        let y = v * canvas.height / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    }
    requestRef.current = requestAnimationFrame(draw);
  };


  const startRecording = () => {
    if (!audioContext.current) {
      console.log('initaiting')
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      console.log(audioContext.current)
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      // if (!analyser.current) {
      //   analyser.current = audioContext.current.createAnalyser();
      //   dataArray.current = new Uint8Array(analyser.current.frequencyBinCount);
      // }

      // const source = audioContext.current.createMediaStreamSource(stream);
      // source.connect(analyser.current);

      // Start the MediaRecorder here
      const newMediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      newMediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };
      newMediaRecorder.start(100); // Adjust timeslice as needed

      setMediaRecorder(newMediaRecorder);
      //draw();
      setIsRecording(true);
    });
  };

  // In Parent Component
  const handleRecordingComplete = (audioFile) => {
    console.log("Received audio file", audioFile);
    // Handle the audio file as needed
  };


  const stopRecording = () => {
    cancelAnimationFrame(requestRef.current);

    mediaRecorder.stop();  // Stop recording
    mediaRecorder.stream.getTracks().forEach(track => track.stop()); // Stop the media stream

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
      if (audioBlob.size > 0) {
        const audioFile = new File([audioBlob], "recording.webm", { type: 'audio/webm' });
        props.onRecordingComplete(audioFile);  // Pass the audio file to the parent component
      }
      setRecordedChunks([]);
    };

    if (audioContext.current) {
      audioContext.current.close();
      audioContext.current = null;
    }

    setIsRecording(false);
  };


  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, [isRecording]);

  return (
    <div>
      <canvas className="w-full h-32 bg-transparent" ref={canvasRef} hidden></canvas>
      <div className="flex justify-center">
        <button
          onClick={toggleRecording}
          className={`px-4 py-2 rounded-full text-white ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} disabled:bg-blue-300`}
          aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
        >
          {isRecording ? 'Stop' : 'Start'} Recording
        </button>
      </div>
    </div>
    // <div>
    //   <canvas className="w-full h-32 bg-transparent" ref={canvasRef}></canvas>
    //   <div className="flex justify-center space-x-4 mt-4">
    //     <button
    //       onClick={startRecording}
    //       disabled={isRecording}
    //       className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300"
    //     >
    //       Start Recording
    //     </button>
    //     <button
    //       onClick={stopRecording}
    //       disabled={!isRecording}
    //       className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 disabled:bg-red-300"
    //     >
    //       Stop Recording
    //     </button>
    //   </div>
    // </div>
  );

};

export default VoiceToFHIRComponent;
