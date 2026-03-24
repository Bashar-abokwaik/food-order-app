export default function Button({
  children,
  textOnly,
  clear,
  className,
  ...props
}) {
  let cssClasses = "";

  if (textOnly) {
    cssClasses = "text-button";
  } else if (clear) {
    cssClasses = "clear-button";
  } else {
    cssClasses = "button";
  }
  cssClasses += " " + className;

  return (
    <button className={cssClasses} {...props}>
      {children}
    </button>
  );
}
