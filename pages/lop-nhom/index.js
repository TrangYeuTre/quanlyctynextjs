import { useRouter } from "next/router";
import { useEffect } from "react";

const LopNhomRoute = (props) => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/lop-nhom/them");
  }, [router]);
};

export default LopNhomRoute;
