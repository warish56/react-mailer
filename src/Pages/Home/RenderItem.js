import React from "react";

import "./style.css";
import { COMPLETED, FAILED, IN_PROGRESS } from "../../Constants";

const TableRow = ({
  style,
  index,
  row,
  progressClass = "",
  progressStatus = "",
}) => {
  // console.log("===rendered===", index);
  return (
    <div
      style={style}
      className={`ex-tb-row ${index % 2 === 0 ? "light" : ""}`}
    >
      {Object.keys(row).map((id) => (
        <div key={row[id]} className="ex-tb-cell">
          {row[id]}
        </div>
      ))}
      <div className={`ex-tb-cell ${progressClass}`}>
        {progressStatus || "---"}
      </div>
    </div>
  );
};

class RenderItem extends React.Component {
  shouldComponentUpdate(prev) {
    const { data, index } = this.props;
    const { rows, mailProgressTable, COLUMN_ID } = data;
    const newStatus = mailProgressTable[rows[index][COLUMN_ID]];
    const oldStatus =
      prev.data.mailProgressTable[prev.data.rows[prev.index][COLUMN_ID]];

    if (oldStatus !== newStatus) {
      return true;
    }
    return false;
  }
  getProgressClass = (status) => {
    switch (status) {
      case COMPLETED:
        return "success";
      case FAILED:
        return "error";
      case IN_PROGRESS:
        return "progress";
      default:
        return "warning";
    }
  };

  render() {
    const { data, style, index } = this.props;
    const { rows, mailProgressTable, COLUMN_ID } = data;

    const progressStatus = mailProgressTable[rows[index][COLUMN_ID]];
    return (
      <TableRow
        //key={rows[index][COLUMN_ID]}
        style={style}
        index={index}
        progressClass={this.getProgressClass(progressStatus)}
        progressStatus={progressStatus}
        row={rows[index]}
      />
    );
  }
}

export default RenderItem;
