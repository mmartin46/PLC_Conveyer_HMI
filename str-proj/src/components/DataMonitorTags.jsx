import React from "react";

class DataMonitorTags extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            monitorHeaders : [
                { className : '', innerClassName : '', value : ''},
                { className : '', innerClassName : '', value : ''}
            ]
        };
    }

    componentDidMount() {
        this.setState({ monitorHeaders : [
            { className : 'bullet', innerClassName : 'get', value : '- GET Request'},
            { className : 'bullet', innerClassName : 'post', value : '-  POST Request'}
        ]});
    }

    render() {
        const { monitorHeaders } = this.state;
        return (
            <div>
                {monitorHeaders.map((element) => (
                    <p className={element.className}>
                    <b className={element.innerClassName}>
                        {element.value}
                    </b>   
                    </p>
                ))};
            </div>
        );
    }
};

export default DataMonitorTags;