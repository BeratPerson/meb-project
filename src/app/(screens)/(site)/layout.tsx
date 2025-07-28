import Header from "@/components/core/header/Header";

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <div className="mt-16 container max-w-screen-2xl">
        {children}
      </div>
    </>
  );
}
