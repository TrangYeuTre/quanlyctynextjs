import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../../components/UI/Loading";

const HocSinhRoute = (props) => {
  const router = useRouter();
  //State loading
  const [loading, setLoading] = useState(true);
  //Side effect set loading
  useEffect(() => {
    if (router.asPath && router.asPath === "/hoc-sinh/them") {
      setLoading(false);
    } else {
      router.replace("/hoc-sinh/them");
    }
  }, [router]);
  return loading && <Loading />;
};

export default HocSinhRoute;
