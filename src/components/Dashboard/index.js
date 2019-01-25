import React, { Component } from "react";
import PropTypes from 'prop-types';
import "./index.scss";
import JobManagement from './JobManagement';
import { ACTIVE_TAB, COMPLETED_TAB } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { DateRange, Calendar } from 'react-date-range';
import { connect } from 'react-redux';
import { orderListAction, switchTabAction } from '../../actions';
import moment from 'moment';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openCalendar: false,
            searchTerm: '',
            startDate: moment(),
            endDate: moment()
        };

        this.onSwitchTab = this.onSwitchTab.bind(this);
        this.toggleCalendar = this.toggleCalendar.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount() {
        this.props.switchTab(ACTIVE_TAB);
    }

    onSearch(e) {
        this.setState({ searchTerm: e.target.value }, () => {

        });
    }

    onSwitchTab(e, status) {
        this.props.switchTab(status);
    }

    toggleCalendar() {
        this.middleRef.style.flex = 2.5;

        this.setState( { openCalendar: !this.state.openCalendar }, () => {
            if (this.state.openCalendar === true) {
                let prevButton = document.getElementsByClassName('rdr-MonthAndYear-button prev');

                for (let property in prevButton) {
                    if (prevButton.hasOwnProperty(property)) {
                        prevButton[property].innerHTML = "";
                    }
                }

                let nextButton = document.getElementsByClassName('rdr-MonthAndYear-button next');

                for (let property in nextButton) {
                    if (nextButton.hasOwnProperty(property)) {
                        nextButton[property].innerHTML = "";
                    }
                }
            }
        });
    }

    handleSelect(range) {
        this.date.innerHTML = range.startDate.format('MM-DD-YYYY') + ' | ' + range.endDate.format('MM-DD-YYYY');
        this.setState({ startDate: range.startDate, endDate: range.endDate });
    }

    createElementFromHTML(htmlString) {
        let div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    }

    render() {
        const activeStyle = {
            borderBottom: '3px solid #21D2F9'
        };

        const inActiveStyle = {
            borderBottom: '3px solid #282828'
        };

        return (
            <div className="dashboard-container">
                <div className="tab-block">
                    <div className="tab-block__left">
                        <span
                            style={this.props.tabStatus === ACTIVE_TAB ? activeStyle : inActiveStyle}
                            onClick={e => this.onSwitchTab(e, ACTIVE_TAB)}>
                            Active
                        </span>
                        <span
                            style={this.props.tabStatus === COMPLETED_TAB ? activeStyle : inActiveStyle}
                            onClick={e => this.onSwitchTab(e, COMPLETED_TAB)}>
                            Completed
                        </span>
                    </div>
                    {this.props.tabStatus === COMPLETED_TAB && <div className="tab-block__middle" ref={node => this.middleRef = node}>
                        <span>Date Range:&nbsp;</span>
                        <span id="date" onClick={this.toggleCalendar} ref={node => this.date = node}>Select</span>
                        <span className="down-arrow">
                            <FontAwesomeIcon className="fa-my-down" color="#ffffff" icon={faChevronDown} onClick={this.toggleCalendar} />
                        </span>
                    </div>}
                    <div className="tab-block__right">
                        <input type="text" value={this.state.searchTerm} onChange={this.onSearch} placeholder="Search" />
                    </div>
                </div>
                <div className="job-list-block">
                    <JobManagement
                        distance={2}
                        searchTerm={this.state.searchTerm}
                        status={this.props.tabStatus}
                        axis="xy"
                        onSortEnd={this.props.onSortEnd}
                        helperClass="sort"
                        startDate={this.state.startDate}
                        endDate={this.state.endDate} />
                </div>
                {this.state.openCalendar &&
                    <div className="calendar">
                        <div className="title">PICK RANGE DATE</div>
                        <DateRange
                            onInit={this.handleSelect}
                            onChange={this.handleSelect}
                        />
                        <div className="bottom" />
                    </div>
                }
            </div>
        );
    }
}

Dashboard.propTypes = {
    jobs: PropTypes.array.isRequired,
    switchTab: PropTypes.func.isRequired,
    tabStatus: PropTypes.number.isRequired
}

const mapStateToProps = state => ({
    jobs: state.dashboard.jobs,
    tabStatus: state.dashboard.tabStatus
});

const mapDispatchToProps = dispatch => ({
    onSortEnd: ({ oldIndex, newIndex }) => dispatch(orderListAction({ oldIndex, newIndex })),
    switchTab: (status) => dispatch(switchTabAction(status))
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);