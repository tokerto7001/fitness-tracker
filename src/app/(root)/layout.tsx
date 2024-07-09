import Header from "@/components/shared/header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-black h-screen w-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-grow overflow-hidden">{children}</div>
    </div>
  );
}
