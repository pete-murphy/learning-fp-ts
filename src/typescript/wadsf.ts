import React, { Component, PropTypes } from "react"
import { Button } from "react-bootstrap"
import moment from "moment"
import ReactTable from "react-table"
import { defaultFilterMethod, includesInsensitive } from "utils/table"
import { initializer, selectors } from "utils/resourcerizer"
import { connect } from "react-redux"
import { USERS_NS } from "constants/index"
const usersInitializer = initializer(USERS_NS)
const usersSelectors = selectors(USERS_NS)
const mstp = (state, ownProps) => ({
  users: usersSelectors.findAll(state, u => u.model == "Candidate"),
})
class candidatesList extends Component {
  static propTypes = {
    candidates: PropTypes.array,
  }
  constructor(props) {
    super(props)
    this.state = { selected: {}, selectAll: 0 }
    this.toggleRow = this.toggleRow.bind(this)
  }
  toggleRow(id) {
    console.log("toggling row")
    const newSelected = Object.assign({}, this.state.selected)
    newSelected[id] = !this.state.selected[id]
    this.setState({
      selected: newSelected,
      selectAll: 2,
    })
    this.props.select(newSelected)
  }
  toggleSelectAll() {
    let newSelected = {}
    if (this.state.selectAll === 0) {
      this.state.candidatesIndexed.forEach(x => {
        newSelected[x.id] = true
      })
    }
    this.setState({
      selected: newSelected,
      selectAll: this.state.selectAll === 0 ? 1 : 0,
    })
    this.props.select(newSelected)
  }
  render() {
    const { isUpdating, all: candidates, selectOne, users } = this.props
    const columns = [
      {
        Header: "#",
        filterable: false,
        accessor: "index",
        Cell: props => props.value + ".",
        maxWidth: 80,
      },
      {
        id: "checkbox",
        accessor: "",
        Cell: ({ original }) => {
          return (
            <input
              original={original}
              type="checkbox"
              className="checkbox"
              checked={this.state.selected[original._id] === true}
              onChange={() => this.toggleRow(original._id)}
            />
          )
        },
        Header: x => {
          return (
            <input
              type="checkbox"
              className="checkbox"
              checked={this.state.selectAll === 1}
              ref={input => {
                if (input) {
                  input.indeterminate = this.state.selectAll === 2
                }
              }}
              onChange={() => this.toggleSelectAll()}
            />
          )
        },
        sortable: false,
        width: 45,
      },
      {
        id: "fullName", // Required because our accessor is not a string
        Header: "Name",
        accessor: candidate => ({
          name: `${candidate.lastName}, ${candidate.firstName}`,
          url: candidate.socialMedia && candidate.socialMedia.linkedInUrl,
        }),
        filterMethod: (filter, row) => {
          return includesInsensitive(row[filter.id].name, filter.value)
        },
        Cell: props => {
          const {
            value: { url, name },
          } = props
          if (url) {
            return (
              <a href={url} target="_blank">
                {name}
              </a>
            )
          } else {
            return <span>{name}</span>
          }
        },
      },
      {
        id: "email",
        Header: "Email",
        accessor: candidate => {
          let u = users.find(u => u._id === candidate.user)
          return (u && u.email) || "null"
        },
      },
      {
        Header: "Location",
        accessor: "location",
      },
      {
        Header: "Recent Job",
        accessor: "recentJob",
      },
      {
        Header: "Recent Income",
        accessor: "recentAnnualIncome",
      },
      {
        id: "resume",
        Header: "Resume",
        accessor: candidate =>
          candidate.resumeId && (
            <a href={`${API_BASE}files/${candidate.resumeId}`} target="_blank">
              <Button>Resume</Button>
            </a>
          ),
        filterable: false,
      },
      {
        id: "actions",
        Header: "Actions",
        sortable: false,
        filterable: false,
        accessor: candidate => (
          <Button onClick={selectOne(candidate._id)}>View Details</Button>
        ),
      },
    ]
    const candidatesIndexed =
      candidates && candidates.map((el, index) => ({ index: index + 1, ...el })) //immutable
    return (
      <ReactTable
        loading={isUpdating || !candidates}
        data={candidatesIndexed}
        columns={columns}
        defaultFilterMethod={defaultFilterMethod}
        filterable
      />
    )
  }
}
const CandidatesList = usersInitializer(connect(mstp)(candidatesList))
export default CandidatesList
