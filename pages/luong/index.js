import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../../components/UI/Loading";

const LuongRoute = (props) => {
  console.log('CHuyển lương')
  const router = useRouter();
  //State loading
  const [loading, setLoading] = useState(true);
  //Side effect set loading
  useEffect(() => {
    if (router.asPath && router.asPath === "/luong/dau-vao") {
      setLoading(false);
    } else {
      router.replace("/luong/dau-vao");
    }
  }, [router]);
  return loading && <Loading />;
};

export default LuongRoute;
