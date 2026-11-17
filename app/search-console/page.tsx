import { ToolPage } from "@/components/tool-page/ToolPage";
import { toolMetadata } from "@/components/tool-page/pages";

export const metadata = toolMetadata("search-console");

export default function Page() {
  return <ToolPage slug="search-console" />;
}
