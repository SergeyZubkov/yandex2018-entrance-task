import "./Button.css";

function Button({ children, className = "", ...otherProps }) {
  let cls = className.split(" ");
  cls.push("btn");
  cls = cls.join(" ").trim();

  return (
    <button className={cls} {...otherProps}>
      {children}
    </button>
  );
}

export default Button;
