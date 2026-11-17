import { ToolPage } from "@/components/tool-page/ToolPage";
import { toolMetadata } from "@/components/tool-page/pages";

export const metadata = toolMetadata("site-audit");

export default function Page() {
  return <ToolPage slug="site-audit" />;
}
