import { useRouter } from "next/router";
import { useEffect } from "react";

const HocSinhRoute = (props) => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/hoc-sinh/them");
  }, [router]);
};

export default HocSinhRoute;
