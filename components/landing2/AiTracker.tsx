import Image from "next/image";
import { AI_PLATFORMS } from "./data";

export default function AiTracker() {
  return (
    <section id="ai" className="l2-ai">
      <div className="l2-ai-panel">
        <div>
          <div className="l2-tag-dark l2-mono">AI Prompt Tracker</div>
          <h2 className="l2-h2-dark">People ask ChatGPT now, not just Google</h2>
          <p className="l2-ai-p">
            Write the prompts your buyers would actually type, run them across the
            four big assistants, and see whether your brand comes up — and who
            gets named instead. One view per platform, each with its own aggregate
            numbers.
          </p>
          <div className="l2-ai-platforms">
            {AI_PLATFORMS.map((p) => (
              <div key={p} className="l2-ai-platform">
                {p}
              </div>
            ))}
          </div>
        </div>
        <Image
          src="/screenshots/07-ai-prompt-tracker.png"
          alt="AI prompt tracker, ChatGPT view"
          width={1125}
          height={846}
          sizes="(max-width: 1024px) 100vw, 600px"
        />
      </div>
    </section>
  );
}
