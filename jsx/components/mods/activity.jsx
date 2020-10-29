export default class ActivityView extends React.Component {
    render() {
        if (this.props.activities.length > 0) {
            return (
                <h1>No ongoing activites.</h1>
            );
        }
        else {
            const bars = this.props.activities.map((activity) => (
                <div class="progress">
                    <div class="determinate" style={{width: `${activity.progress}%`}}></div>
                </div>
            ));

            return <>{bars}</>;
        }
    }
}