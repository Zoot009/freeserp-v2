import { ToolPage } from "@/components/tool-page/ToolPage";
import { toolMetadata } from "@/components/tool-page/pages";

export const metadata = toolMetadata("google-maps-rank-tracker");

export default function Page() {
  return <ToolPage slug="google-maps-rank-tracker" />;
}
