import { Link } from 'react-router-dom'

import { APP_ROUTES } from '../../app/routes.js'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <section className="not-found" role="status">
      <span>404</span>
      <h1>Nie znaleźliśmy tej strony</h1>
      <p>Adres mógł się zmienić albo widok nie jest jeszcze dostępny.</p>
      <Link className="button button--primary" to={APP_ROUTES.home}>Wróć do strony głównej</Link>
    </section>
  )
}
