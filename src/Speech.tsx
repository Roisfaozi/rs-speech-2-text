// Login.js
import { useState } from 'react';
import useSpeechToText, { ResultType } from 'react-hook-speech-to-text';

const Speech = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {
    error,
    isRecording,
    results,
    interimResult,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: false,
    crossBrowser: true,
    googleApiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
    useLegacyResults: false,
    googleCloudRecognitionConfig: {
      languageCode: 'id-ID',
    },
    speechRecognitionProperties: {
      lang: 'id-ID',
      interimResults: true // Allows for displaying real-time speech results
    }
  });
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

  };
  const handleRecord = async (field: 'username' | 'password') => {
    if (isRecording === true)
      stopSpeechToText()

    if (isRecording === false) startSpeechToText()

    const getResult = results[results.length - 1] as ResultType
    if (field === 'username') {
      setUsername(getResult.transcript);
      console.log(username)
    } else {
      setPassword(getResult.transcript);
    }
  }


  return (
    <div style={{
      width: '300px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: '100%',
            height: '40px',
            marginBottom: '20px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}
        />
        <button onClick={() => handleRecord('username')} >
          🎤
        </button>
        <br />
        <label style={{ display: 'block', marginBottom: '10px' }}>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            height: '40px',
            marginBottom: '20px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}
        />
        <button onClick={() => handleRecord('password')} >
          🎤
        </button>
        <br />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          type="submit"
          style={{
            width: '100%',
            height: '40px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </form>

      <ul>
        {(results as ResultType[]).map((result) => (
          <li key={result.timestamp}>{result.transcript}</li>
        ))}
        {interimResult && <li>interim {interimResult}</li>}
      </ul>
    </div>
  );
};

export default Speech;