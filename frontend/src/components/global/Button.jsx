/** Padroniza os botões interativos usados nas páginas do front. */
export default function Button({ variant = 'primary', className = '', ...props }) {
  const classes = ['button', `button--${variant}`, className].filter(Boolean).join(' ');
  return <button className={classes} {...props} />;
}
