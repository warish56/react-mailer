import React, { useCallback, useState } from "react";
import { FixedSizeList as List } from "react-window";

import useExcelReader from "./useExcelReader";
import useMailSend from "./useMailSend";

import Progress from "../../components/Progress";
import ActivityIndicator from "../../components/ActivityIndicator";

import RenderItem from "./RenderItem";

import FILES_IMG from "../../Assets/files.png";
import MAIL_SENT_IMG from "../../Assets/mailSent.png";
import MAIL_IMG from "../../Assets/mail.png";

import PROCESSING_IMG from "../../Assets/processing.png";
import UNDER_PROGRESS_IMG from "../../Assets/underProgress.png";

import "./style.css";

const Excel = () => {
  const [COLUMN_ID, updateColumnId] = useState("");
  const { readExcelFile, rows, fileProcessing, resetFiles } = useExcelReader();
  const { mailProgress, sendMail, resetProgress, downloadLink } = useMailSend({
    key: COLUMN_ID,
  });

  const { allMailSent, data: mailProgressTable } = mailProgress;

  const onFileChange = useCallback((e) => {
    const file = e.target.files[0];
    readExcelFile(file);
  }, []);

  const onReset = useCallback(() => {
    resetFiles();
    resetProgress();
    updateColumnId("");
  }, []);

  const onMailSend = useCallback(() => {
    if (mailProgress.inProgress) {
      return;
    }

    if (!COLUMN_ID) {
      window.alert("Please select a unique column ");
      return;
    }

    sendMail(rows);
  }, [mailProgress, rows, COLUMN_ID, sendMail]);

  const onIdSelect = useCallback((e) => {
    const { type } = e.target.dataset;
    updateColumnId(type);
  }, []);

  const getImage = useCallback(() => {
    if (rows.length === 0) {
      return FILES_IMG;
    }

    if (fileProcessing) {
      return PROCESSING_IMG;
    }

    if (rows.length > 0 && !allMailSent && !mailProgress.inProgress) {
      return MAIL_IMG;
    }

    if (mailProgress.inProgress) {
      return UNDER_PROGRESS_IMG;
    }

    if (allMailSent) {
      return MAIL_SENT_IMG;
    }
  }, [rows.length, fileProcessing, mailProgress, allMailSent]);

  const totalFiles = rows.length || 1;
  const { completedCount, failedCount, inProgress } = mailProgress;

  return (
    <div className="ex-container center">
      <div className="count-container">
        <p className="success">Pass: {completedCount}</p>
        <p className="error">Fail: {failedCount}</p>
        {allMailSent && failedCount > 0 && (
          <a
            download="failed_list"
            rel="noopener noreferrer"
            target="_blank"
            href={downloadLink}
          >
            Download List
          </a>
        )}
      </div>

      <div className="action-content center">
        <img
          alt="current action pic"
          className="action-content-img"
          src={getImage()}
        />

        {rows.length === 0 && (
          <>
            <label htmlFor="ex-file" className="action-label center">
              Upload File
            </label>
            <input
              onChange={onFileChange}
              className="action-input"
              id="ex-file"
              type="file"
            />
          </>
        )}

        {rows.length > 0 && !allMailSent && (
          <button
            disabled={inProgress}
            onClick={onMailSend}
            className="send-btn center"
          >
            {inProgress ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              " Send Mail"
            )}
          </button>
        )}

        {allMailSent && (
          <button onClick={onReset} className="send-btn center">
            reset
          </button>
        )}

        <div className="progress-display">
          <Progress
            progress={((completedCount + failedCount) / totalFiles) * 100}
          />
        </div>
      </div>

      <div className="excel-table">
        {rows.length > 0 && (
          <>
            <div className="t-head-container">
              {Object.keys(rows[0]).map((key) => {
                return (
                  <div
                    data-type={key}
                    role="button"
                    onClick={onIdSelect}
                    className={`t-head center ${
                      COLUMN_ID === key ? "selected-id" : ""
                    }`}
                  >
                    {key}
                  </div>
                );
              })}
              <div className="t-head center">Status</div>
            </div>
            <List
              height={window.innerHeight / 2}
              itemCount={rows.length}
              itemSize={50}
              width={window.innerWidth}
              itemKey={(index, data) => {
                return data.rows[index][`First Name`];
              }}
              itemData={{ rows, mailProgressTable, COLUMN_ID }}
            >
              {RenderItem}
            </List>
          </>
        )}
      </div>
    </div>
  );
};

export default Excel;
