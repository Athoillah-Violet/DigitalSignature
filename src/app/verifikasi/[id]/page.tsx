export default async function VerifikasiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>Verifikasi Detail {id}</div>;
}
