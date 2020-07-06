onmessage = (e) => {
  const { rows = [], key } = e.data;
  console.log("==recievde====", rows);

  const completed = [];
  const failed = [];
  let Sstart = 0;
  let Fstart = 0;

  const CHUNK_SIZE = 100;

  const interval = setInterval(() => {
    const Ssize = completed.length;
    const Fsize = failed.length;

    console.log("====length===", Ssize, Fsize, Sstart, Fstart);

    if (Sstart >= Ssize && Fstart >= Fsize) {
      clearInterval(interval);
    }
    const s = [];
    const f = [];
    let i = 0;
    for (i = Sstart; i < Sstart + CHUNK_SIZE && i < Ssize; i++) {
      s.push(completed[i]);
    }

    Sstart = i;
    let j = 0;

    for (j = Fstart; j < Fstart + CHUNK_SIZE && j < Fsize; j++) {
      f.push(failed[j]);
    }
    Fstart = j;
    postMessage(
      JSON.stringify({
        inProgress: false,
        success: true,
        successlistData: s,
        failedListData: f,
      })
    );
  }, 4000);

  rows.forEach((row, index) => {
    fetch("https://reqres.in/api/users?page=2", {
      method: "GET",
    })
      .then(() => {
        completed.push(row[key]);
      })
      .catch(() => {
        failed.push(row[key]);
      });

    // postMessage(JSON.stringify({ inProgress: true, id: row[key] }));
  });
};
