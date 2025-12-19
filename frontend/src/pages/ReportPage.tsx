import ReportIssueForm from "../components/report/ReportForm";
import SupportSidebar from "../components/report/ReportSidebar";


// ⚠️ ĐỔI PATH đúng dự án bạn
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function ReportIssuePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={null as any} loading={false} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-4">
            <SupportSidebar />
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-8">
            <ReportIssueForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
