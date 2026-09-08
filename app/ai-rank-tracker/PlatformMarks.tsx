/**
 * The four AI platforms FreeSERP tracks, drawn as brand marks.
 *
 * Inline SVG rather than files in /public: four marks are smaller as markup than
 * as four network requests, and the hero renders complete in the first paint —
 * which on a paid click is the difference between a platform row and a row of
 * empty boxes.
 *
 * A sibling of app/tracking-suite/PlatformMarks.tsx, kept separate rather than
 * imported: that one draws seven surfaces at a fixed 18px for a logo strip, this
 * one draws four at whatever size the block it heads asks for. Sharing it would
 * mean one file serving two campaigns, and a size prop added for this page
 * changing the other page's strip.
 *
 * `id` matches the backend's Platform union (llmPlatform.adapter.ts), so a block
 * on this page and a row in the dashboard are talking about the same thing.
 */

export type PlatformId = "chat_gpt" | "claude" | "gemini" | "perplexity";

export function PlatformMark({ id, size = 24 }: { id: PlatformId; size?: number }) {
  const Mark = MARKS[id];
  return <Mark size={size} />;
}

const MARKS: Record<PlatformId, (p: { size: number }) => React.ReactElement> = {
  chat_gpt: ChatGptMark,
  claude: ClaudeMark,
  gemini: GeminiMark,
  perplexity: PerplexityMark,
};

/** ChatGPT. Single-colour path, so it takes the tone it is placed on. */
function ChatGptMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.6 9.8a5.9 5.9 0 0 0-.5-4.9 6 6 0 0 0-6.4-2.9A6 6 0 0 0 4.5 4.1a5.9 5.9 0 0 0-4 2.9 6 6 0 0 0 .7 7 5.9 5.9 0 0 0 .5 4.9 6 6 0 0 0 6.4 2.9 6 6 0 0 0 10.2-2.1 5.9 5.9 0 0 0 4-2.9 6 6 0 0 0-.7-7Zm-8.9 12.4a4.4 4.4 0 0 1-2.8-1l.1-.1 4.7-2.7a.8.8 0 0 0 .4-.7v-6.6l2 1.2v5.5a4.5 4.5 0 0 1-4.4 4.4ZM3.1 17.5a4.4 4.4 0 0 1-.5-3l.1.1 4.7 2.7a.8.8 0 0 0 .8 0l5.7-3.3v2.3l-4.8 2.8a4.5 4.5 0 0 1-6-1.6ZM1.9 7.7a4.4 4.4 0 0 1 2.3-1.9v5.6a.8.8 0 0 0 .4.7l5.7 3.3-2 1.1-4.8-2.7a4.5 4.5 0 0 1-1.6-6Zm16.6 3.9-5.7-3.3 2-1.1 4.8 2.7a4.5 4.5 0 0 1-.7 8.1v-5.6a.8.8 0 0 0-.4-.8Zm2-3-.1-.1-4.7-2.7a.8.8 0 0 0-.8 0L9.2 9.1V6.8L14 4a4.5 4.5 0 0 1 6.5 4.6ZM8.1 13.1l-2-1.2V6.4A4.5 4.5 0 0 1 14 3.5l-.1.1L9.2 6.3a.8.8 0 0 0-.4.7v6.1Zm1-2.3L11.7 9l2.6 1.5v3L11.7 15l-2.6-1.5v-3Z" />
    </svg>
  );
}

/** Claude. */
function ClaudeMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#d97757"
        d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z"
      />
    </svg>
  );
}

/** Gemini. */
function GeminiMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4a7dfc"
        d="M12 2c.5 3.2 1.6 5.4 3.3 6.9C16.7 10.1 18.6 11 21 11.5c-2.5.6-4.4 1.5-5.8 2.8C13.5 15.9 12.5 18.3 12 22c-.5-3.5-1.5-5.9-3-7.4C7.6 13.2 5.7 12.2 3 11.6c2.7-.6 4.6-1.6 6-3C10.5 7.1 11.5 5 12 2Z"
      />
    </svg>
  );
}

/** Perplexity. */
function PerplexityMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <g
        fill="none"
        stroke="#20808D"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3.4v17.2" />
        <path d="M12 7.6 5.4 3.4v6.2h13.2V3.4L12 7.6Z" />
        <path d="M12 16.4l-6.6 4.2v-6.2h13.2v6.2L12 16.4Z" />
      </g>
    </svg>
  );
}
