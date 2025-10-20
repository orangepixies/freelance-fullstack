export default function Footer(){
  return (
    <footer className="border-t border-line mt-16">
      <div className="container py-8 flex items-center justify-between">
        <div>
          <div className="font-bold">Freelance Full‑Stack</div>
          <div className="text-muted text-sm">Based in Indonesia · Available worldwide</div>
        </div>
        <div className="flex items-center gap-3">
          <a className="card w-9 h-9 grid place-items-center" href="#" aria-label="GitHub">
            <span>GH</span>
          </a>
          <a className="card w-9 h-9 grid place-items-center" href="#" aria-label="LinkedIn">
            <span>in</span>
          </a>
          <a className="card w-9 h-9 grid place-items-center" href="#" aria-label="X">
            <span>X</span>
          </a>
        </div>
      </div>
    </footer>
  )
}