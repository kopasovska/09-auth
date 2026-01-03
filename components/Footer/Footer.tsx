import css from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p className={css.footerText}>
          © {new Date().getFullYear()} NoteHub. All rights reserved.
        </p>
        <div className={css.wrap}>
          <p className={css.footerText}>Developer: Viktoria Kopasovska</p>
          <p className={css.footerText}>
            Contact us:{' '}
            <a href="mailto:student@notehub.app">v.kopasovska@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
