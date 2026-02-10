import { useEffect, useRef, useState } from "react"

export default function CameraModal({ onCapture, onClose }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [error, setError] = useState("")

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
      .catch(() => {
        setError("Camera access denied")
      })

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  function capturePhoto() {
    if (!videoRef.current) return

    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight

    const ctx = canvas.getContext("2d")
    ctx.drawImage(videoRef.current, 0, 0)

    const imageData = canvas.toDataURL("image/jpeg", 0.85)
    onCapture(imageData)
  }

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center px-4 bg-black/80">
      <div className="p-8 w-full max-w-xl rounded-2xl border shadow-2xl bg-slate-900 border-white/10">

        {/* Header */}
        <h2 className="mb-2 text-lg font-semibold text-center text-white">
          Align your face inside the frame
        </h2>
        <p className="mb-4 text-sm text-center text-slate-400">
          Make sure your face is clearly visible before capturing
        </p>

        {/* Error */}
        {error && (
          <div className="px-4 py-2 mb-4 text-sm text-center text-red-400 rounded-lg bg-red-500/10">
            {error}
          </div>
        )}

        {/* Camera Preview */}
        <div className="mb-6">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="object-cover w-full h-80 bg-black rounded-xl md:h-96"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={capturePhoto}
            className="flex-1 py-4 text-lg font-semibold text-white bg-emerald-600 rounded-xl transition hover:bg-emerald-700 active:scale-95"
          >
            Capture
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-4 text-lg rounded-xl bg-slate-700 text-slate-200 hover:bg-slate-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
