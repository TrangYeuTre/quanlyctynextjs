import classes from "./Search.module.css";
import { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { MdOutlineClear } from "react-icons/md";

const Search = (props) => {
  //Mong đợi
  const { getKeyword, hint } = props;
  //State lấy key word
  const [keyword, setKeyword] = useState("");
  //Cb
  const setKeywordHandler = (e) => {
    setKeyword(e.target.value);
  };
  //Cb
  const clearInputHandler = () => {
    setKeyword("");
  };
  //Side effect truyn value lên
  useEffect(() => {
    const delay = setTimeout(() => {
      getKeyword(keyword);
    }, 500);
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
        // defaultValue=""
      />
      <div className={classes.icon}>
        <BsSearch size="1.4rem" style={{ color: "gray" }} />
      </div>
      <div className={classes.clearIcon} onClick={clearInputHandler}>
        <MdOutlineClear size="1.8rem" className={classes.iconClear} />
      </div>
    </div>
  );
};

export default Search;
