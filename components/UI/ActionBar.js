import classes from "./ActionBar.module.css";

const ActionBar = (props) => {
  const {
    action1,
    action2,
    doAction1,
    doAction2,
    description,
    disAction1,
    disAction2,
  } = props;
  //Cb
  const action1Handler = () => {
    doAction1();
  };
  const action2Handler = () => {
    doAction2();
  };

  return (
    <section className={classes.container}>
      <div className={classes.description}>
        <p>{description}</p>
      </div>
      <div className={classes.actions}>
        {action1 && (
          <div
            className={
              !disAction1
                ? classes.action1
                : `${classes.action1} ${classes.disabled}`
            }
            onClick={!disAction1 ? action1Handler : null}
          >
            {action1}
          </div>
        )}
        {action2 && (
          <div
            className={
              !disAction2
                ? classes.action2
                : `${classes.action2} ${classes.disabled}`
            }
            onClick={!disAction2 ? action2Handler : null}
          >
            {action2}
          </div>
        )}
      </div>
    </section>
  );
};

export default ActionBar;
