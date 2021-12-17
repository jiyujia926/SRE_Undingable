import React from "react";
import TablePro from "../../components/TablePro/TablePro";

export default function CustomizationList() {
  //const classes = useStyles();
  return (
    <div>
      <TablePro
        data={{
          columns: [
            { field: "id", headerName: "ID", width: 90 },
            { field: "repoName", headerName: "Repo Name", width: 200 },
            { field: "address", headerName: "Repo Address", width: 200 },
            { field: "favorTime", headerName: "Favor Time", width: 150 },
          ],
          rows: [
            {
              id: 1,
              repoName: "JYJ/BaiCaoJian",
              address: "github/JYJ/BCJ",
              favorTime: "yy-mm-dd",
            },
            {
              id: 2,
              repoName: "JYJ/Clouding",
              address: "github/JYJ/Clouding",
              favorTime: "yy-mm-dd",
            },
            {
              id: 3,
              repoName: "meta/React",
              address: "github/meta/React",
              favorTime: "yy-mm-dd",
            },
            {
              id: 4,
              repoName: "meta/Oculus",
              address: "github/meta/Oculus",
              favorTime: "yy-mm-dd",
            },
            {
              id: 5,
              repoName: "QsTech/zju-icicle",
              address: "github/QsTech/zju-icicle",
              favorTime: "yy-mm-dd",
            },
            {
              id: 6,
              repoName: "MS/HoloLens",
              address: "github/MS/HoloLens",
              favorTime: "yy-mm-dd",
            },
          ],
          pageRows: 5,
          checkBox: true,
        }}
      />
    </div>
  );
}
