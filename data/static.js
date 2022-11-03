export const navItems = () => {
  const arrNavItems = [
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
        { id: "c-3", route: "/day-bu", name: "Dạy bù" },
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
      children: [
        { id: "c-1", route: "/tinh", name: "Tính học phí tháng mới" },
        { id: "c-2", route: "/ket-qua", name: "Kết quả tính" },
      ],
    },
    {
      id: "i-7",
      route: "/luong",
      name: "Lương giáo viên",
      children: [
        { id: "c-1", route: "/tinh", name: "Tính lương" },
        { id: "c-2", route: "/ket-qua", name: "Kết quả tính" },
      ],
    },
    { id: "i-8", route: "/auth/logout", name: "Logout" },
  ];
  return arrNavItems;
};
