"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Download } from "lucide-react"

interface PDFModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PDFModal({ isOpen, onClose }: PDFModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(90vh*0.707)] max-w-3xl h-[90vh] bg-black border-[3px] border-gray-500/20 animate-[shimmer_4s_ease-in-out_infinite] rounded-md p-0 overflow-hidden">
        <div className="relative w-full h-full">
          <div className="absolute top-2 right-8 z-10 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-gray-300 bg-black/80 backdrop-blur-sm"
              asChild
            >
              <a href="/resume/JUSTIN_FOOTE_Resume.pdf" download>
                <Download className="h-4 w-4" />
                <span className="sr-only">Download Resume</span>
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-gray-300 bg-black/80 backdrop-blur-sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <iframe
            src="/resume/JUSTIN_FOOTE_Resume.pdf#toolbar=0"
            className="w-full h-full"
            title="Resume PDF"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 