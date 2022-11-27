import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../../components/UI/Loading";

const GiaoVienRoute = (props) => {
  const router = useRouter();
  //State loading
  const [loading, setLoading] = useState(true);
  //Side effect set loading
  useEffect(() => {
    if (router.asPath && router.asPath === "/giao-vien/them") {
      setLoading(false);
    } else {
      router.replace("/giao-vien/them");
    }
  }, [router]);
  return loading && <Loading />;
};

export default GiaoVienRoute;
