import classes from "./Card.module.css";

const Card = (props) => {
  const { isSubBg } = props;
  return (
    <section className={!isSubBg ? classes.container : classes.subContainer}>
      {props.children}
    </section>
  );
};

export default Card;
