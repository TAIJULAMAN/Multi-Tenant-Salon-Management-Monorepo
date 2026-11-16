import { redirect } from "next/navigation";

export default async function WorkedShiftsDetailRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/worked-shifts/${id}`);
}
