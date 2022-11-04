import classes from "./CTA.module.css";

const Card = (props) => {
  const { message } = props;
  return (
    <section className={classes.container}>
      <div className={classes.content}>
        {message && (
          <div className={classes.message}>
            {" "}
            <p>{message}</p>
          </div>
        )}
        <div className={classes.actions}>{props.children}</div>
      </div>
    </section>
  );
};

export default Card;
