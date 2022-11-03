import classes from "./Card.module.css";

const Card = (props) => {
  return <section className={classes.container}>{props.children}</section>;
};

export default Card;
