
// src/LoginForm.tsx
import { useState } from 'react';
import useRecording from './hooks/useRecording';
import useTranscription from './hooks/useTranscription';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { audioBlob, startRecording, stopRecording, recording } = useRecording();
  const { recognizeSpeech, transcription } = useTranscription();

  const handleStartRecording = async () => {
    await startRecording();
  };

  const handleStopRecording = async (field: string) => {

    stopRecording();
    if (audioBlob) {
      await recognizeSpeech(audioBlob).then(() => {
        if (field === 'username') {
          setUsername(transcription);
        } else {
          setPassword(transcription);
        }
      });
    } else {
      console.error('No audio blob available');
    }
  };

  const handleRecord = async (field: 'username' | 'password') => {

    if (recording === false) {
      handleStartRecording()
    } else {
      handleStopRecording(field)
    }
  }


  return (
    <div>
      <h1>Login Form</h1>
      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <button onClick={() => handleRecord('username')} >
          🎤
        </button>
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button onClick={() => handleRecord('password')}>
          🎤
        </button>
      </div>

    </div>
  );
};

export default LoginForm;