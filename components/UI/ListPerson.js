import classes from "./ListPerson.module.css";
import Search from "./Search";
import { useEffect, useState, useContext } from "react";
import { sortArtByLastShortName } from "../../helper/uti";

const ListPerson = (props) => {
  //Lấy mảng người xuống render --> Mục tiêu của comp này là trả lại lên trên mảng tương ứng với ngươjf được chọn
  //Ghi chú : vẫn trả lại lên trên mảng full với những người có isSelected, không phải mảng filter ra người isSelectd nhé
  const { arrPeople } = props;
  //State mảng người
  const [arrPeopleRender, setArrPeopleRender] = useState([]);
  //Lấy keywords lên từ Search để lọc
  const [keyword, setKeyword] = useState("");
  //Cb xử lý lấy keyword từ sẻach
  const getKeywordHandler = (keyword) => {
    setKeyword(keyword);
  };
  //CB phụ
  //CB chọn người / bỏ chọn luôn
  const chonNguoiHandler = (id) => {
    console.log(id);
    //Clone mảng state đẻ tương tác
    const arrClone = [...arrPeopleRender];
    //Tìm và đánh isSelected
    const indexNguoiMatched = arrClone.findIndex(
      (i) => i.id.toString() === id.toString()
    );
    if (indexNguoiMatched !== -1) {
      arrClone[indexNguoiMatched].isSelected =
        !arrClone[indexNguoiMatched].isSelected;
      setArrPeopleRender(sortArtByLastShortName(arrClone));
    }
  };
  //Side effect lọc lại mảng theo search đẻ rende ra
  useEffect(() => {
    //Xử lý search học sinh
    if (keyword === "" || !keyword) {
      setArrPeopleRender(sortArtByLastShortName(arrPeople));
    } else {
      const arrFilter = arrPeople.filter((pp) => {
        return pp.shortName
          .trim()
          .toLowerCase()
          .includes(keyword.trim().toLowerCase());
      });
      setArrPeopleRender(sortArtByLastShortName(arrFilter));
    } //end if
  }, [arrPeople, keyword]);
  //Props
  return (
    <div className={classes.container}>
      {/* Search nhanh nè */}
      <div style={{ width: "70%", margin: "0 auto" }}>
        <Search
          hint="Tìm nhanh tên học sinh ..."
          getKeyword={getKeywordHandler}
        />
      </div>
      {/* Danh sách tags */}
      {arrPeople.length > 0 && (
        <ul className={classes.tags}>
          {arrPeopleRender.map((person) => {
            let finalStyle = classes.tag;
            if (person.isSelected) {
              finalStyle = `${classes.tag} ${classes.tagActive}`;
            }
            return (
              <li
                className={finalStyle}
                key={person.id}
                onClick={chonNguoiHandler.bind(0, person.id)}
              >
                {person.shortName}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ListPerson;
