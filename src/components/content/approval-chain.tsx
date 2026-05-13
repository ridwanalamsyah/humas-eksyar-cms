"use client";

import { motion } from "motion/react";
import { Avatar } from "@/components/common/avatar";
import { findMember } from "@/lib/fixtures/members";
import { findDivision } from "@/lib/fixtures/divisions";
import { CheckCircle2, Clock4, Send, Sparkles } from "lucide-react";
import type { ContentItem } from "@/lib/data/types";

const STAGE_ORDER = ["draft", "review_divisi", "review_sekjen", "scheduled", "published"] as const;
const STAGE_LABEL: Record<(typeof STAGE_ORDER)[number], string> = {
  draft: "Draft",
  review_divisi: "Review Divisi",
  review_sekjen: "Review Sekjen",
  scheduled: "Scheduled",
  published: "Published",
};

export function ApprovalChain({ content }: { content: ContentItem }) {
  const division = findDivision(content.divisionId);
  const reachedIndex = STAGE_ORDER.indexOf(
    (content.status === "idea" ? "draft" : content.status) as (typeof STAGE_ORDER)[number],
  );

  return (
    <div className="mt-3 flex flex-col gap-2">
      {STAGE_ORDER.map((stage, i) => {
        const reached = i <= reachedIndex && reachedIndex !== -1;
        const isCurrent = i === reachedIndex;
        const responsibleId =
          stage === "review_divisi"
            ? division.leadId
            : stage === "review_sekjen"
              ? "mbr-evi"
              : stage === "draft"
                ? content.authorId
                : null;
        const member = responsibleId ? findMember(responsibleId) : null;

        return (
          <motion.div
            key={stage}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 280, damping: 28 }}
            className={`relative flex items-center gap-3 rounded-xl px-3 py-2 ${
              isCurrent
                ? "bg-amber-400/10 ring-1 ring-amber-400/30"
                : reached
                  ? "bg-brand-500/8"
                  : "bg-foreground/5 dark:bg-white/5"
            }`}
          >
            <span className="grid size-7 place-items-center rounded-full bg-background text-foreground/65 ring-1 ring-foreground/10 dark:bg-foreground/15 dark:ring-white/10">
              {isCurrent ? (
                <Clock4 className="size-3.5 text-amber-600 dark:text-amber-300" strokeWidth={2} />
              ) : reached ? (
                <CheckCircle2 className="size-3.5 text-brand-600 dark:text-brand-300" strokeWidth={2} />
              ) : stage === "scheduled" ? (
                <Send className="size-3.5" strokeWidth={2} />
              ) : (
                <Sparkles className="size-3 opacity-60" strokeWidth={2} />
              )}
            </span>
            <div className="flex-1">
              <p className="text-[12px] font-semibold">{STAGE_LABEL[stage]}</p>
              {member ? (
                <p className="text-[10px] text-foreground/55">{member.name}</p>
              ) : stage === "scheduled" ? (
                <p className="text-[10px] text-foreground/55">{content.scheduledFor ? "Dijadwalkan" : "Belum dijadwalkan"}</p>
              ) : (
                <p className="text-[10px] text-foreground/45">—</p>
              )}
            </div>
            {member && (
              <Avatar member={member} size={22} ring={false} />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
