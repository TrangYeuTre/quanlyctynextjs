import { useRouter } from "next/router";
import { useEffect } from "react";

const GiaoVienRoute = (props) => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/giao-vien/them");
  }, [router]);
};

export default GiaoVienRoute;
