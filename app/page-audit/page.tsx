import { ToolPage } from "@/components/tool-page/ToolPage";
import { toolMetadata } from "@/components/tool-page/pages";

export const metadata = toolMetadata("page-audit");

export default function Page() {
  return <ToolPage slug="page-audit" />;
}
