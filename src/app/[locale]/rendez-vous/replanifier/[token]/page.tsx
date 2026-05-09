export default async function ReschedulePage({
  params
}: {
  params: Promise<{ locale: string; token: string }>
}) {
  const { token } = await params
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Replanifier votre rendez-vous</h1>
        <p className="text-gray-mid mt-4">Token : {token}</p>
      </div>
    </main>
  )
}
