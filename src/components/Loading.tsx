import css from "./Loading.module.css";

function Loading() {
  return (
    <div className={css.root}>
      <img
        alt="HiChess"
        src="/icon-512.png"
        width={128}
        height={128}
        className={css.logo}
      />
    </div>
  );
}

export default Loading;
