import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../../components/UI/Loading";

const HocPhiRoute = (props) => {
  const router = useRouter();
  //State loading
  const [loading, setLoading] = useState(true);
  //Side effect set loading
  useEffect(() => {
    if (router.asPath && router.asPath === "/hoc-phi/dau-vao") {
      setLoading(false);
    } else {
      router.replace("/hoc-phi/dau-vao");
    }
  }, [router]);
  return loading && <Loading />;
};

export default HocPhiRoute;
