export default function Sign({ isAuthenticated, onClick }) {
  if (isAuthenticated) {
    return <button className="account-button" onClick={onClick} type="button"><span>K</span> Konto</button>
  }

  return <button className="account-button account-button--guest" onClick={onClick} type="button">Zaloguj się</button>
}
