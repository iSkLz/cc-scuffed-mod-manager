export default class ActivityView extends React.Component {
    render() {
        if (this.props.activities.length > 0) {
            const bars = this.props.activities.map((activity) => (<>
                <div className="row">
                    <div className="col s3 center" style={{fontSize: "17px"}}>{activity.name}</div>
                    <div className="col s8">
                        <div className="progress">
                            <div className="determinate" style={{width: `${activity.progress}%`}}></div>
                        </div>
                    </div>
                    <div className="col s1 center">
                        <span className="material-icons" onClick={activity.change || doNothing}>
                            {activity.paused ? "play_arrow" : "pause"}
                        </span>
                        <span className="material-icons" onClick={activity.cancel || doNothing}>clear</span>
                    </div>
                </div>
                <br />
            </>));

            return <><br />{bars}</>;
        }
        else {
            return (
                <h2>No ongoing activites.</h2>
            );
        }
    }
}

function doNothing() {}