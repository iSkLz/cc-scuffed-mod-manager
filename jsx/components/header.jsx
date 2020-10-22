export default class Header extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = (e) => {
            this.props.onViewChange(e.target.getAttribute("view"));
        }

        this.createHeaderButton = this.createHeaderButton.bind(this);
    }

    render() {
        return (
            <nav>
                <div className="nav-wrapper">
                    <span className="brand-logo"> &nbsp; {this.props.children}</span>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        {this.createHeaderButton("browse", "Mods Browser")}
                        {this.createHeaderButton("manage", "Installed Mods")}
                        {this.createHeaderButton("activity", "Activity View")}
                    </ul>
                </div>
            </nav>
        );
    }

    createHeaderButton(view, label) {
        let isActive = this.props.activeView == view;
        if (isActive)
            return <li className="active"><a href="#!" view={view} onClick={this.handleClick}>{label}</a></li>;
        else
            return <li><a href="#!" view={view} onClick={this.handleClick}>{label}</a></li>;
    }
}