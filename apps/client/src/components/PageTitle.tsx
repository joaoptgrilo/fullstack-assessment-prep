// Remova: import styles from "./PageTitle.module.css";

interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
  // Substitua por classes do Tailwind
  return (
    <h1 className="mb-10 text-center text-3xl text-secondary font-mono">
      {title}
    </h1>
  );
};

export default PageTitle;
