
import { createClient } from "@/utils/supabaseServerClient";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const supabase = createClient();
  const {data, error} = await supabase.auth.getUser();
  if(!data && !error) return (<div>Loading</div>);
  if(!error || data?.user) redirect('/');

  return (
    <>
        {children}
    </>
  );
}