import classes from "./ListPerson.module.css";
import Search from "./Search";
import { useEffect, useState, useContext } from "react";
import { sortArtByLastShortName } from "../../helper/uti";
import ActionBar from "./ActionBar";

const ListPerson = (props) => {
  //Lấy mảng người xuống render --> Mục tiêu của comp này là trả lại lên trên mảng tương ứng với ngươjf được chọn
  //Ghi chú : vẫn trả lại lên trên mảng full với những người có isSelected, không phải mảng filter ra người isSelectd nhé
  //arrPeopleSelected là mảng truyền xuống để đánh người đã được chọn sẵn nếu có
  const { arrPeople, getArrResult, arrPeopleSelected, hintAction } = props;
  //State mảng người
  const [arrPeopleRender, setArrPeopleRender] = useState([]);
  //Lấy keywords lên từ Search để lọc
  const [keyword, setKeyword] = useState("");
  //Cb xử lý lấy keyword từ sẻach
  const getKeywordHandler = (keyword) => {
    setKeyword(keyword);
  };
  //CB chọn người / bỏ chọn luôn
  const chonNguoiHandler = (id) => {
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
  //CB chính trả lại kết quả
  const getArrResultHandler = () => {
    getArrResult(arrPeopleRender);
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
  //Side effect đánh mảng người được selectd nếu có
  useEffect(() => {
    if (arrPeopleSelected.length > 0) {
      const arrClone = [...arrPeople];
      //Phải luôn clear isSelected của arrClone này
      arrClone.forEach((i) => (i.isSelected = false));
      //Chạy lặp mảng default để đánh
      for (let i = 0; i < arrPeopleSelected.length; i++) {
        const curId = arrPeopleSelected[i].id.toString();
        const personMatched = arrClone.findIndex(
          (i) => i.id.toString() === curId
        );
        if (personMatched !== -1) {
          arrClone[personMatched].isSelected = true;
        }
      } //end for
      //Cuối cùng là set lại mảng render
      setArrPeopleRender(sortArtByLastShortName(arrClone));
    }
  }, [arrPeople, arrPeopleSelected]);
  //Props
  return (
    <div className={classes.container}>
      {/* Search nhanh nè */}
      <div style={{ width: "90%", margin: "0 auto" }}>
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
      {/* Actions xác thực mảng người được chọn để trả về comp trên */}
      <ActionBar
        description={hintAction}
        action1="Chốt"
        doAction1={getArrResultHandler}
      />
    </div>
  );
};

export default ListPerson;
