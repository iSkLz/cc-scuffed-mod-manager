import ModsList from "./mods/list.js";
import ModDetails from "./mods/details.js";

export default class View extends React.Component {
    constructor(props) {
        super(props);

        this.modDetailsRef = React.createRef();

        this.changeSelectedMod = (mod) => {
            this.modDetailsRef.current.displayModDetails(mod);
        };
    }

    render() {
        switch (this.props.view) {
            case "browse":
                return renderModsBrowser();
            case "activity":
                return renderActivity();
            default:
                return renderModsManager();
        }
    }

    renderModsManager() {
        return (
            <div id="manage-view" class="row">
                <div id="installed-mods-list" className="col s6">
                    <ModsList type="installed" onSelectMod={} />
                </div>

                <div id="installed-mods-list" className="col s6">
                    <ModDetails type="installed" ref={this.modDetailsRef} />
                </div>
            </div>
        );
    }

    renderModsBrowser() {

    }

    renderActivity() {

    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.view == nextProps.view) return false;
        return true;
    }
}