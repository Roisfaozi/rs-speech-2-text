import { useEffect, useState } from 'react'

const useRecording = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [recording, setRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)

  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [mediaRecorder])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      recorder.start()
      console.log('Recording started')

      recorder.addEventListener('dataavailable', (event: BlobEvent) => {
        setAudioBlob(event.data)
        console.log('Base64 audio:', audioBlob)
      })

      setRecording(true)
      setMediaRecorder(recorder)
    } catch (error) {
      console.error('Error getting user media:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      console.log('Recording stopped')
      setAudioBlob(null)
      setRecording(false)
    }
  }

  return { recording, startRecording, stopRecording, mediaRecorder, audioBlob }
}

export default useRecording
