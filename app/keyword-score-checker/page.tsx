import { ToolPage } from "@/components/tool-page/ToolPage";
import { toolMetadata } from "@/components/tool-page/pages";

export const metadata = toolMetadata("keyword-score-checker");

export default function Page() {
  return <ToolPage slug="keyword-score-checker" />;
}
