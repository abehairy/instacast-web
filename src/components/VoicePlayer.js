import React, { useState, useEffect, useRef } from 'react';

const VoicePlayerComponent = ({ audioUrl, audioFile }) => {
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const dataArray = useRef(null);
  const requestRef = useRef(null);
  const canvasRef = useRef(null);
  const [audioBuffer, setAudioBuffer] = useState(null);

  const drawPlaceholderWaveform = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Placeholder waveform (simulate a waveform before the actual audio is played)
    ctx.fillStyle = "#f0f0f0";
    let x = 0;
    const width = canvas.width / 50; // Simulate 50 bars
    for (let i = 0; i < 50; i++) {
      const height = Math.random() * canvas.height;
      ctx.fillRect(x, canvas.height / 2 - height / 2, width - 1, height);
      x += width;
    }
  };

  const draw = () => {
    if (analyser.current && dataArray.current) {
      analyser.current.getByteTimeDomainData(dataArray.current);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

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

  useEffect(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioUrl) {
      fetch(audioUrl)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.current.decodeAudioData(arrayBuffer))
        .then(decodedAudio => {
          setAudioBuffer(decodedAudio);
          drawPlaceholderWaveform(); // Draw the placeholder waveform

        });
    } else if (audioFile && audioFile instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result;
        audioContext.current.decodeAudioData(arrayBuffer)
          .then(decodedAudio => {
            setAudioBuffer(decodedAudio);
            drawPlaceholderWaveform(); // Draw the placeholder waveform
          });
      };
      reader.readAsArrayBuffer(audioFile);
    }


    return () => {
      cancelAnimationFrame(requestRef.current);
      if (audioContext.current) {
        audioContext.current.close();
        audioContext.current = null;
      }
    };
  }, [audioUrl]);

  const playAudio = () => {
    if (audioBuffer && audioContext.current) {
      const source = audioContext.current.createBufferSource();
      source.buffer = audioBuffer;
      analyser.current = audioContext.current.createAnalyser();
      dataArray.current = new Uint8Array(analyser.current.frequencyBinCount);
      source.connect(analyser.current);
      analyser.current.connect(audioContext.current.destination);
      source.start();
      draw();
    }
  };

  return (
    <div className="voice-player-container">
      <button onClick={playAudio} className="play-button">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </button>
      <canvas ref={canvasRef} className="waveform-canvas"></canvas>
    </div>
    // <div className="relative inline-block">
    //   <canvas ref={canvasRef} width="300" height="100"></canvas>
    //   <button onClick={playAudio}
    //     style={{
    //       boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
    //       borderRadius: '50%',
    //       width: '40px',
    //       height: '40px',
    //       display: 'flex',
    //       alignItems: 'center',
    //       justifyContent: 'center',
    //       backgroundColor: '#1D4ED8', // Darker blue color
    //       color: 'white',
    //       border: 'none',
    //       outline: 'none',
    //       cursor: 'pointer'
    //     }}
    //     className="absolute right-2 bottom-2"
    //   >
    //     <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="feather feather-play">
    //       <polygon points="5 3 19 12 5 21 5 3"></polygon>
    //     </svg>
    //   </button>
    // </div>
    // <div>
    //   <canvas ref={canvasRef}></canvas>
    //   <button onClick={playAudio} className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600">
    //     Play
    //   </button>

    // </div>
  );
};

export default VoicePlayerComponent;
