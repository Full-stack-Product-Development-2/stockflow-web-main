import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { stockSummaryGreeting } from "@/data/mock/stock-summary";

function GreetingBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#ad2500] via-[#e94713] to-[#ff8354] px-6 py-5 text-white shadow-sm">
      <div className="absolute -right-20 -top-24 size-72 rounded-full bg-orange-200/15 blur-3xl" />

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Dismiss greeting"
        className="absolute right-3 top-3 text-white/80 hover:bg-white/10 hover:text-white"
        onClick={() => setIsVisible(false)}
      >
        <X className="size-4" />
      </Button>

      <div className="relative max-w-2xl">
        <p className="text-[11px] font-semibold tracking-wide text-orange-100">
          {stockSummaryGreeting.role}
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight">
          {stockSummaryGreeting.title}
        </h2>
        <p className="mt-1.5 max-w-xl text-sm leading-5 text-orange-50">
          {stockSummaryGreeting.description}
        </p>
        <p className="mt-2 text-xs text-orange-100">{stockSummaryGreeting.date}</p>
      </div>
    </section>
  );
}

export default GreetingBanner;
