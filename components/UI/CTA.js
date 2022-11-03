import classes from "./CTA.module.css";

const Card = (props) => {
  const { message } = props;
  return (
    <seciton className={classes.container}>
      <div className={classes.content}>
        {message && (
          <div className={classes.message}>
            {" "}
            <p>{message}</p>
          </div>
        )}
        <div className={classes.actions}>{props.children}</div>
      </div>
    </seciton>
  );
};

export default Card;
