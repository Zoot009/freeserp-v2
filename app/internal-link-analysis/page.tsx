import { ToolPage } from "@/components/tool-page/ToolPage";
import { toolMetadata } from "@/components/tool-page/pages";

export const metadata = toolMetadata("internal-link-analysis");

export default function Page() {
  return <ToolPage slug="internal-link-analysis" />;
}
