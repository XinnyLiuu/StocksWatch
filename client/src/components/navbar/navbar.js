class Navbar extends React.Component {
    render() {
        return(
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
             <a className="navbar-brand" href="#">StockWatch</a>
             <div className="collapse navbar-collapse">
                  <form className="form-inline">
                    <input className="form-control" type="search" placeholder="Search stocks" aria-lable="Search">
                    <button className="btn btn-outline" type="submit">Search</button>
                  </form>
               <ul className="navbar-nav">
                  <li className="nav-item">
                    <a className="nav-link" href="#">Login</a>
                  </li>
                  <li className="nav-item">
                     <a className="nav-link" href="#">SignUp</a>
                  </li>
               </ul>
             </div>
          </nav>
        );
    }
}
