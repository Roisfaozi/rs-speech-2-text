import { useEffect, useState } from 'react'

interface MediaRecorderHook {
  mediaRecorder: MediaRecorder | null
  createMediaRecorder: () => Promise<void>
}

const useMediaRecorder = (): MediaRecorderHook => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)

  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [mediaRecorder])

  const createMediaRecorder = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      setMediaRecorder(recorder)
    } catch (error) {
      console.error('Error getting user media:', error)
    }
  }

  return { mediaRecorder, createMediaRecorder }
}

export default useMediaRecorder
