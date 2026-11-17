import { ToolPage } from "@/components/tool-page/ToolPage";
import { toolMetadata } from "@/components/tool-page/pages";

export const metadata = toolMetadata("youtube-rank-tracker");

export default function Page() {
  return <ToolPage slug="youtube-rank-tracker" />;
}
