import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

const VoiceToFHIRComponent = (props) => {
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const dataArray = useRef(null);
  const requestRef = useRef(null);
  const canvasRef = useRef(null);
  const [mimeType, setMimeType] = useState('');

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


      // Determine the supported mimeType
      let selectedMimeType = 'audio/mp4'; // Default mimeType
      if (MediaRecorder.isTypeSupported('audio/webm')) {
        selectedMimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        selectedMimeType = 'audio/mp4';
      } else {
        alert('Neither audio/webm nor audio/mp4 is supported. Falling back to default mimeType.');
      }
      setMimeType(selectedMimeType); // Store the selected MIME type


      const newMediaRecorder = new MediaRecorder(stream, { mimeType: selectedMimeType });
      newMediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };
      newMediaRecorder.start(100); // Adjust timeslice as needed

      setMediaRecorder(newMediaRecorder);
      //draw();
      setIsRecording(true);
    }).catch(e => {
      //alert(JSON.stringify(e))
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
      const audioBlob = new Blob(recordedChunks, { type: mimeType });
      if (audioBlob.size > 0) {
        const extension = mimeType.split('/')[1]
        const audioFile = new File([audioBlob], "recording." + extension, { type: mimeType });
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

    <div className="relative w-full flex justify-center items-center" >
      {/* Other content of the container goes here */}
      <div className="bottom-0 mb-10">
        <button
          onClick={toggleRecording}
          className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none"
          style={{ boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)' }}
          aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
        >
          <FontAwesomeIcon icon={faMicrophone} className="mr-2" />
          {isRecording ? 'Stop' : 'Start'} Recording
        </button>
      </div>
      {/* Rest of the content */}
    </div>

  );

};

export default VoiceToFHIRComponent;
