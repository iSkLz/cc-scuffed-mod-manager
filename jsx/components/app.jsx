export class App extends React.Components {
	
	render() {
		return
		<div id="root">
			<nav>
				<div className="nav-wrapper">
					<span className="brand-logo"> &nbsp; Scuffed Mod Manager</span>
					<ul id="nav-mobile" className="right hide-on-med-and-down">
						<li><a href="#!" onClick={showModsBrowser}>Mods Browser</a></li>
						<li><a href="#!" onClick={showModsManager}>Installed Mods</a></li>
						<li><a href="#!" onClick={showActivityView}>Activity View</a></li>
					</ul>
				</div>
			</nav>
			<br />
		</div>;
	}
}