import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../../components/UI/Loading";

const DdnROute = (props) => {
  const router = useRouter();
  //State loading
  const [loading, setLoading] = useState(true);
  //Side effect set loading
  useEffect(() => {
    if (router.asPath && router.asPath === "/ddcn/diem-danh") {
      setLoading(false);
    } else {
      router.replace("/ddcn/diem-danh");
    }
  }, [router]);
  return loading && <Loading />;
};

export default DdnROute;
