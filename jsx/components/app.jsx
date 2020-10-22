import Header from "./header.js";
import View from "./view.js";

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activeView: "manage"
		};

		this.changeView = (view) => {
			this.setState({
				activeView: view
			});
		}
	}


	render() {
		return (
			<div id="app">
				<Header activeView={this.state.activeView} onViewChange={this.changeView}>Scuffed Mod Manager</Header>
				<br />

				<div className="container">
					<View view={this.state.activeView}></View>
				</div>
			</div>
		);
	}
}