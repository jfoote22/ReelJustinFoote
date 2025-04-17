"use client"

import { Button } from "./ui/button"
import { X } from "lucide-react"

interface PDFEmbedProps {
  pdfUrl: string
  onClose: () => void
}

export default function PDFEmbed({ pdfUrl, onClose }: PDFEmbedProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex justify-center items-center p-4">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-lg overflow-hidden">
        <Button 
          variant="ghost" 
          className="absolute top-2 right-2 z-10 text-gray-800 hover:bg-gray-200" 
          onClick={onClose}
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </Button>
        
        <iframe
          src={pdfUrl}
          className="w-full h-full"
          title="Resume PDF"
        />
      </div>
    </div>
  )
} 