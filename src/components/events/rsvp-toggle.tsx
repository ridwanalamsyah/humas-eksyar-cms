"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Check, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RSVPToggle({ initial = false }: { initial?: boolean }) {
  const [rsvp, setRsvp] = useState(initial);
  return (
    <div className="mt-3">
      <Button
        className="w-full"
        variant={rsvp ? "secondary" : "primary"}
        onClick={() => {
          setRsvp((v) => !v);
          toast.success(
            !rsvp ? "RSVP terkirim. Sampai jumpa di acara!" : "RSVP dibatalkan.",
          );
        }}
      >
        <AnimatePresence mode="wait">
          {rsvp ? (
            <motion.span
              key="on"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="inline-flex items-center gap-2"
            >
              <Check className="size-4" strokeWidth={2.25} />
              Sudah RSVP — Batalkan
            </motion.span>
          ) : (
            <motion.span
              key="off"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="inline-flex items-center gap-2"
            >
              <Calendar className="size-4" strokeWidth={2} />
              Saya akan hadir
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
}
