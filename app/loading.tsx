import { Loading as BaseLoading } from "@/components/loading";

export default function Loading() {
  return (
    <BaseLoading loading>
      <section className="h-screen w-screen" />
    </BaseLoading>
  );
}
