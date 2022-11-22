import { useRouter } from "next/router";
import { useEffect } from "react";

const DdcnRoute = (props) => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/ddcn/diem-danh");
  }, [router]);
};

export default DdcnRoute;
