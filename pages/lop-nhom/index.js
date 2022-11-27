import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../../components/UI/Loading";

const LopNhomRoute = (props) => {
  const router = useRouter();
  //State loading
  const [loading, setLoading] = useState(true);
  //Side effect set loading
  useEffect(() => {
    if (router.asPath && router.asPath === "/lop-nhom/them") {
      setLoading(false);
    } else {
      router.replace("/lop-nhom/them");
    }
  }, [router]);
  return loading && <Loading />;
};

export default LopNhomRoute;
