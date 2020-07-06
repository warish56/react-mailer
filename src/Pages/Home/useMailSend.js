import { useState, useCallback, useEffect } from "react";
import { COMPLETED, FAILED } from "../../Constants";

const useMailSend = ({ key }) => {
  const [totalFiles, updateTotalFiles] = useState(0);
  const [downloadLink, updateLink] = useState("");
  const [mailProgress, updateFileProgress] = useState({
    inProgress: false,
    completedCount: 0,
    failedCount: 0,
    data: {},
    failedList: [],
    allMailSent: false,
  });

  const createFailedList = useCallback(() => {
    console.log("===list====", mailProgress.failedList);
    const blob = new Blob([JSON.stringify(mailProgress.failedList, null, 2)], {
      type: "application/json",
    });
    updateLink(URL.createObjectURL(blob), { type: "application/json" });
  }, [mailProgress.failedList]);

  useEffect(() => {
    const { completedCount, failedCount, allMailSent } = mailProgress;
    if (allMailSent) {
      return;
    }
    if (totalFiles > 0 && completedCount + failedCount === totalFiles) {
      updateFileProgress((prevData) => ({
        ...prevData,
        inProgress: false,
        allMailSent: true,
      }));
      createFailedList();
    }

    // console.log("==total count===", completedCount + failedCount, totalFiles);
  }, [mailProgress, totalFiles, createFailedList]);

  const resetProgress = useCallback(() => {
    updateTotalFiles(0);
    updateFileProgress({
      inProgress: false,
      completedCount: 0,
      failedCount: 0,
      data: {},
      failedList: [],
      allMailSent: false,
    });
    updateLink("");
  }, []);

  const onMailSentSucess = useCallback((data = []) => {
    data.forEach((id) => {
      updateFileProgress((prevData) => ({
        ...prevData,
        completedCount: prevData.completedCount + 1,
        data: {
          ...prevData.data,
          [id]: COMPLETED,
        },
      }));
    });
  }, []);

  const onMailSentFailed = useCallback((data = []) => {
    data.forEach((id) => {
      updateFileProgress((prevData) => ({
        ...prevData,
        failedCount: prevData.failedCount + 1,
        data: {
          ...prevData.data,
          [id]: FAILED,
        },
        failedList: [...prevData.failedList, id],
      }));
    });
  }, []);

  const sendMail = useCallback(
    (rows) => {
      updateTotalFiles(rows.length);
      updateFileProgress((prevData) => ({
        ...prevData,
        inProgress: true,
        data: {},
      }));

      const worker = new Worker("./worker.js");

      worker.onmessage = (event) => {
        const message = event.data;
        const {
          // inProgress,
          successlistData = [],
          failedListData = [],
        } = JSON.parse(message);
        // if (inProgress) {
        //   updateMailProgressTable((prevData) => ({
        //     ...prevData,
        //     [id]: IN_PROGRESS,
        //   }));
        // }

        console.log("===recieved====", successlistData, failedListData);

        onMailSentSucess(successlistData);

        onMailSentFailed(failedListData);
      };

      worker.postMessage({ rows, key });
    },
    [key]
  );
  return {
    mailProgress,
    sendMail,
    resetProgress,
    downloadLink,
  };
};

export default useMailSend;
