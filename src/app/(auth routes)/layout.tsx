export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <section>
        <div className="min-h-[50vh]">{children}</div>
      </section>
    </>
  );
}
