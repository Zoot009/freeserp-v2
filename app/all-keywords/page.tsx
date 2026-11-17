import { ToolPage } from "@/components/tool-page/ToolPage";
import { toolMetadata } from "@/components/tool-page/pages";

export const metadata = toolMetadata("all-keywords");

export default function Page() {
  return <ToolPage slug="all-keywords" />;
}
