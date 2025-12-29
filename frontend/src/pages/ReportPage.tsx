import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; 

import ReportIssueForm from "../components/report/ReportForm";
import SupportSidebar from "../components/report/ReportSidebar";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import { profileApi, type User } from "../api/auth.api";

export default function ReportPage() {
  const [searchParams] = useSearchParams(); 
  const urlType = searchParams.get("type"); 
  const urlId = searchParams.get("id");    

  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const tk =
        localStorage.getItem("token") || localStorage.getItem("accessToken");
      if (!tk) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const u = await profileApi();
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      } catch {
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user as any} loading={loading} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SupportSidebar />
          </div>

          <div className="lg:col-span-8">
            <ReportIssueForm 
              defaultEmail={(user as any)?.email || ""}
              // TRUYỀN DỮ LIỆU VÀO FORM
              initialType={urlType}
              initialId={urlId}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}