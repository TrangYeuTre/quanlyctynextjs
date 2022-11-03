import classes from "./Search.module.css";
import { useState, useEffect } from "react";

const Search = (props) => {
  //Mong đợi
  const { getKeyword, hint } = props;
  //State lấy key word
  const [keyword, setKeyword] = useState();
  //Cb
  const setKeywordHandler = (e) => {
    setKeyword(e.target.value);
  };
  //Side effect truyn value lên
  useEffect(() => {
    const delay = setTimeout(() => {
      getKeyword(keyword);
    }, 1200);
    return () => {
      clearTimeout(delay);
    };
  }, [keyword, getKeyword]);
  //Trả
  return (
    <div className={classes.container}>
      <input
        type="text"
        value={keyword}
        onChange={setKeywordHandler}
        placeholder={hint}
      />
    </div>
  );
};

export default Search;
