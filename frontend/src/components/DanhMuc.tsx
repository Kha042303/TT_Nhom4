const DanhMuc = () => {
  return (
    <div className="bg-sky-500 text-white py-16 text-center px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-3">Sách hay gần bạn, trao đổi nhanh!</h1>
      <p className="text-sky-100 mb-8 text-sm md:text-base">Tìm cuốn sách tuyệt vời tiếp theo từ cộng đồng yêu sách.</p>
      
      <div className="max-w-2xl mx-auto bg-white rounded-lg p-1 flex shadow-lg">
        <button className="px-4 py-2 text-gray-600 text-sm font-medium border-r border-gray-200 flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-l-md whitespace-nowrap">
          <i className="fas fa-bars"></i>
          <span className="hidden sm:inline">Danh mục</span>
          <i className="fas fa-caret-down text-xs ml-1"></i>
        </button>
        <div className="flex-1 flex items-center px-4">
            <i className="fas fa-search text-gray-400 mr-3"></i>
            <input 
                type="text" 
                placeholder="Tìm kiếm theo tiêu đề, tác giả, ISBN..." 
                className="w-full outline-none text-gray-700 placeholder-gray-400"
            />
        </div>
        <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-md font-medium transition-colors">
          Tìm kiếm
        </button>
      </div>
    </div>
  );
};
export default DanhMuc;