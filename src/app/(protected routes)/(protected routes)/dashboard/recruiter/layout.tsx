import { RecruiterLayout } from "./_components/shared/RecruiterLayout";

export default function Recruiter_Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <section>
        <RecruiterLayout> {children} </RecruiterLayout>
      </section>
    </>
  );
}
