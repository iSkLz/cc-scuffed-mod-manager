export default class ActivityView extends React.Component {
    render() {
        if (this.props.activities.length > 0) {
            const bars = this.props.activities.map((activity) => (
                <div className="progress">
                    <div className="determinate" style={{width: `${activity.progress}%`}}></div>
                </div>
            ));

            return <>{bars}</>;
        }
        else {
            return (
                <h1>No ongoing activites.</h1>
            );
        }
    }
}