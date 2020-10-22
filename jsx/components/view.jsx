export default class View extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <h1>{this.props.view}</h1>
        );
    }
}