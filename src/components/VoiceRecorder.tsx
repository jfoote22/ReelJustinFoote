"use client"

import { useState, useRef } from "react"
import { Mic, Square } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState("")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      const audioChunks: Blob[] = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        // For now, we'll just log the audio blob
        console.log("Audio recording completed:", audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        size="icon"
        variant="outline"
        onClick={isRecording ? stopRecording : startRecording}
        className={`rounded-full border-2 ${
          isRecording ? "border-red-500 text-red-500" : "border-white text-white"
        }`}
      >
        {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>
      {transcription && (
        <p className="text-white text-center max-w-md">{transcription}</p>
      )}
    </div>
  )
}