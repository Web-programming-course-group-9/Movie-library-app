import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>Sivua ei löytynyt</h1>
      <Link to="/">Etusivulle</Link>
    </div>
  )
}
