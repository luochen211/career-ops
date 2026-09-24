import type { Metadata } from "next";
import { WorkflowStory } from "@/components/workflow-story";

export const metadata: Metadata = {
  title: "运行流程与门禁 · career-ops",
  description: "按步骤了解 career-ops 如何发现职位、评估匹配度、生成材料，以及何时停下等待求职者决定。",
};

export default function WorkflowPage() {
  return <WorkflowStory />;
}
