
// import KhungAnh from "../components/book-detail/KhungAnh";
// import TinhTrangSach from "../components/book-detail/TinhTrangSach";
// import TTSeller from "../components/book-detail/TTSeller";
// import ThongTinSach from "../components/book-detail/ThongTinSach";
// import MotaChiTiet from "../components/book-detail/MotaChiTiet";
// import SachTuongTu from "../components/book-detail/SachTuongTu";
// import type { BookDetailUI, SimilarBookUI } from "../components/book-detail/types";

// // ⚠️ đổi path theo dự án bạn
// import Header from "../components/layout/Header";
// import Footer from "../components/layout/Footer";

// export default function BookDetailPage() {
//   /**
//    * UI-only, KHÔNG mock data.
//    * Khi nối API:
//    * - bạn lấy bookDetail từ BE và truyền vào các component (hoặc dùng state/store).
//    */
//   const book: BookDetailUI | undefined = undefined;
//   const sachtuongtu: SimilarBookUI[] | undefined = undefined;

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Header user={null as any} loading={false} />

//       <main className="mx-auto max-w-6xl px-4 py-6">

//         <div className="mt-6 grid gap-8 lg:grid-cols-12">
//           {/* LEFT */}
//           <div className="lg:col-span-7">
//             <KhungAnh images={book?.images} statusLabel={book?.statusLabel} />
//           </div>

//           {/* RIGHT */}
//           <div className="lg:col-span-5 space-y-4">
//             <TinhTrangSach
//               badge={book?.badge}
//               viewsText={book?.viewsText}
//               title={book?.title}
//               author={book?.author}
//               price={book?.price}
//               oldPrice={book?.oldPrice}
//               discountPercent={book?.discountPercent}
//               condition={book?.condition}
//               location={book?.location}
//             />

//             <TTSeller seller={book?.seller} />

//             <ThongTinSach meta={book?.meta} />
//           </div>
//         </div>

//         <div className="mt-10">
//           <MotaChiTiet />
//         </div>

//         <div className="mt-12">
//           <SachTuongTu books={sachtuongtu} />
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }
