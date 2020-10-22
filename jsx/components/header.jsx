export default class Header extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = (e) => {
            this.props.onViewChange(e.target.getAttribute("view"));
        }
    }

    render() {
        return (
            <nav>
                <div className="nav-wrapper">
                    <span className="brand-logo"> &nbsp; {this.props.children}</span>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><a href="#!" view="browse" onClick={this.handleClick}>Mods Browser</a></li>
                        <li><a href="#!" view="manage" onClick={this.handleClick}>Installed Mods</a></li>
                        <li><a href="#!" view="activity" onClick={this.handleClick}>Activity View</a></li>
                    </ul>
                </div>
            </nav>
        );
    }
}