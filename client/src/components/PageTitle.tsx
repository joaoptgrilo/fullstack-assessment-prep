import styles from "./PageTitle.module.css";

interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
  return <h1 className={styles.pageTitle}>{title}</h1>;
};

export default PageTitle;
