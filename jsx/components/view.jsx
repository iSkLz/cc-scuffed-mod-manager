import ModsList from "./mods/list.js";
import ModDetails from "./mods/details.js";

// TODO: Investigate INSANE memory leak when the window is resized a lot
export default class View extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedMod: null,
            fullView: window.innerWidth > 1280
        };

        this.changeSelectedMod = (mod) => {
            this.setState({
                selectedMod: mod
            });
        };

        this.nullifySelectedMod = () => {
            this.setState({
                selectedMod: null
            });
        };

        // Attach handler to adapt to window resizing if necessary
		window.onresize = (e) => {
            // Handler might still be around after the view dies, so we account
			if (this) {
                this.setState({
                    fullView: window.innerWidth > 1280
                });
            }
		};
    }

    render() {
        if (this.props.view === "activity") {
            // TODO: Implement the activity view
        }
        else {
            if (this.state.fullView)
                return (
                    <div id="manage-view" className="row full-height">
                        <div id="mods-list" className="col s4 full-height">
                            <ModsList type={this.props.view} selected={this.state.selectedMod}
                                onSelectMod={this.changeSelectedMod} />
                        </div>

                        <div id="mod-details" className="col s8 full-height">
                            <ModDetails type={this.props.view} modIndex={this.state.selectedMod}
                                onNavigate={this.changeSelectedMod} />
                        </div>
                    </div>
                );
            else
                if (this.state.selectedMod != null)
                    return (
                        <div id="manage-view" className="row full-height">
                            <div id="mod-details" className="col s12 full-height">
                                <ModDetails type={this.props.view} modIndex={this.state.selectedMod} small={true}
                                    onNavigate={this.changeSelectedMod} onReturn={this.nullifySelectedMod} />
                            </div>
                        </div>
                    );
                else
                    return (
                        <div id="manage-view" className="row full-height">
                            <div id="mod-details" className="col s12 full-height">
                                <ModsList type={this.props.view} selected={this.state.selectedMod} small={true}
                                    onSelectMod={this.changeSelectedMod} />
                            </div>
                        </div>
                    );
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Don't update if the view, selected mod & window size are the same as before
        if (this.props.view === nextProps.view && this.state.selectedMod === nextState.selectedMod
            && this.state.fullView === nextState.fullView)
            return false;
        return true;
    }
}