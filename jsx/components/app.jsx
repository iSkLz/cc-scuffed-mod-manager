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
				<Header onViewChange={this.changeView}>Scuffed Mod Manager</Header>
				<View view={this.state.activeView}></View>
				<br />
			</div>
		);
	}
}