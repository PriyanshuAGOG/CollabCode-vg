"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function MobileWarning() {
  const isMobile = useIsMobile()

  return (
    <Dialog open={isMobile}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-[#0A0A0F] to-[#1A1A2E] border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-center">Device Not Supported</DialogTitle>
        </DialogHeader>
        <div className="p-4 text-center">
          <p>This platform is not supported on mobile devices. Please use a desktop browser for the best experience.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
