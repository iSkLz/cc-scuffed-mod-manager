import Header from "./header.js";
import View from "./view.js";

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activeView: "manage",
		};

		this.changeView = (view) => {
			this.setState({
				activeView: view
			});
		};
	}

	render() {
		return (
			<View view={this.props.activeView}></View>
		);
	}
}