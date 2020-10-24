import ModsList from "./mods/list.js";
import ModDetails from "./mods/details.js";

export default class View extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedMod: null
        };

        this.changeSelectedMod = (mod) => {
            this.setState({
                selectedMod: mod
            });
        };
    }

    render() {
        switch (this.props.view) {
            case "browse":
                return this.renderModsBrowser();
            case "activity":
                return this.renderActivity();
            default:
                return this.renderModsManager();
        }
    }

    renderModsManager() {
        return (
            <div id="manage-view" className="row full-height">
                <div id="mods-list" className="col s4 full-height">
                    <ModsList type="installed" selected={this.state.selectedMod} onSelectMod={this.changeSelectedMod} />
                </div>

                <div id="mod-details" className="col s8 full-height">
                    <ModDetails type="installed" modIndex={this.state.selectedMod} />
                </div>
            </div>
        );
    }

    renderModsBrowser() {

    }

    renderActivity() {

    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.view == nextProps.view && this.state.selectedMod == nextState.selectedMod)
            return false;
        return true;
    }
}