import classes from "./ActionBar.module.css";

const ActionBar = (props) => {
  const { action1, action2, doAction1, doAction2, description } = props;
  //Cb
  const action1Handler = () => {
    doAction1();
  };
  const action2Handler = () => {
    doAction2();
  };

  return (
    <section className={classes.container}>
      <div className={classes.description}>{description}</div>
      <div className={classes.actions}>
        {action1 && (
          <div className={classes.action1} onClick={action1Handler}>
            {action1}
          </div>
        )}
        {action2 && (
          <div className={classes.action2} onClick={action2Handler}>
            {action2}
          </div>
        )}
      </div>
    </section>
  );
};

export default ActionBar;
