import Header from "@/components/shared/header";
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
  if(error || !data?.user) redirect('/signin');

  return (
    <div className="bg-black h-screen w-screen flex flex-col overflow-hidden text-white">
      <Header />
      <div className="flex-grow overflow-hidden">{children}</div>
    </div>
  );
}
