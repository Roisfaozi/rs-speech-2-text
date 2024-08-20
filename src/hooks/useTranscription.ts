import axios from 'axios'
import { useEffect, useState } from 'react'

interface TranscriptionHook {
  transcription: string
  recognizeSpeech: (audioBlob: Blob) => Promise<void>
}

const useTranscription = (): TranscriptionHook => {
  const [transcription, setTranscription] = useState('')
  const [apiKey, setApiKey] = useState('')

  useEffect(() => {
    if (!import.meta.env.VITE_APP_GOOGLE_API_KEY) {
      throw new Error('VITE_APP_GOOGLE_API_KEY not found in the environment')
    }
    setApiKey(import.meta.env.VITE_APP_GOOGLE_API_KEY)
  }, [])

  const recognizeSpeech = async (audioBlob: Blob) => {
    try {
      setTranscription('')
      const base64Audio = await audioBlobToBase64(audioBlob)
      const response = await axios.post(
        `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
        {
          config: {
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 48000,
            languageCode: 'id-ID',
          },
          audio: {
            content: base64Audio,
          },
        }
      )
      const transcriptionResult =
        response.data.results[0].alternatives[0].transcript
      console.log(transcriptionResult)
      setTranscription(transcriptionResult)
      console.log('trasncription', transcription)
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error with Google Speech-to-Text API:',
          error?.response?.data
        )
      } else {
        console.error('Unknown error:', error)
      }
    }
  }

  return { transcription, recognizeSpeech }
}

export default useTranscription

const audioBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const arrayBuffer = reader.result as ArrayBuffer
      const base64Audio = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      )
      resolve(base64Audio)
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(blob)
  })
}
