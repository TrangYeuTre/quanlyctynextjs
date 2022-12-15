export const navItems = () => {
  const ARR_NAV_ITEMS = [
    {
      id: "i-1",
      route: "/hoc-sinh",
      name: "Học sinh",
      children: [
        { id: "c-1", route: "/them", name: "Thêm học sinh" },
        { id: "c-2", route: "/ds-ca-nhan", name: "Danh sách cá nhân" },
        { id: "c-3", route: "/ds-nhom", name: "Danh sách nhóm" },
      ],
    },
    {
      id: "i-2",
      route: "/giao-vien",
      name: "Giáo viên",
      children: [
        { id: "c-1", route: "/them", name: "Thêm giáo viên" },
        { id: "c-2", route: "/ds-giao-vien", name: "Danh sách giáo viên" },
        { id: "c-3", route: "/hs-phu-trach", name: "Học sinh phụ trách" },
        { id: "c-4", route: "/lich-giao-vien", name: "Lịch giáo viên" },
      ],
    },
    {
      id: "i-3",
      route: "/lop-nhom",
      name: "Lớp nhóm",
      children: [
        { id: "c-1", route: "/them", name: "Thêm lớp nhóm" },
        { id: "c-2", route: "/ds-lop-nhom", name: "Danh sách lớp nhóm" },
      ],
    },
    {
      id: "i-4",
      route: "/ddcn",
      name: "Điểm danh cá nhân",
      children: [
        { id: "c-1", route: "/diem-danh", name: "Điểm danh" },
        { id: "c-2", route: "/day-the", name: "Dạy thế" },
        // { id: "c-3", route: "/day-bu", name: "Dạy bù" },
        { id: "c-4", route: "/thong-ke-giao-vien", name: "Thống kê giáo viên" },
        { id: "c-5", route: "/thong-ke-hoc-sinh", name: "Thống kê học sinh" },
      ],
    },
    {
      id: "i-5",
      route: "/ddn",
      name: "Điểm danh nhóm",
      children: [
        { id: "c-1", route: "/diem-danh", name: "Điểm danh" },
        { id: "c-2", route: "/ket-qua", name: "Kết quả điểm danh tháng" },
      ],
    },
    {
      id: "i-6",
      route: "/hoc-phi",
      name: "Học phí học sinh",
      children: [{ id: "c-3", route: "/dau-vao", name: "Xử lý đầu vào" }],
    },
    {
      id: "i-7",
      route: "/luong",
      name: "Lương giáo viên",
      children: [{ id: "c-1", route: "/dau-vao", name: "Xử lý đầu vào" }],
    },
    // { id: "i-8", route: "/auth/signOut", name: "Sign Out" },
  ];
  return ARR_NAV_ITEMS;
};

export const arrThu = () => {
  const ARR_THU = [
    { id: "mon", value: "mon", name: "Hai", isSelected: false },
    { id: "tue", value: "tue", name: "Ba", isSelected: false },
    { id: "wed", value: "wed", name: "Tư", isSelected: false },
    { id: "thu", value: "thu", name: "Năm", isSelected: false },
    { id: "fri", value: "fri", name: "Sáu", isSelected: false },
    { id: "sat", value: "sat", name: "Bảy", isSelected: false },
    { id: "sun", value: "sun", name: "Chủ nhật", isSelected: false },
  ];
  return ARR_THU;
};
