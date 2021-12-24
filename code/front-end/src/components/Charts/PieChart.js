import React, { useEffect } from "react";
import * as eCharts from "echarts";
import { nanoid } from "nanoid";
import PropTypes from "prop-types";
import FileSaver from "file-saver";
// import download from "../../assets/img/download.svg";

const PieChart = (props) => {
  const { data } = props;
  let id = nanoid();
  // concat name
  let series_items = [];
  let sum = [];
  for (let i = 0; i < data.length && data[i].data !== undefined; i++) {
    let tmp_item = {};
    let tmp_sum = 0;
    tmp_item.name = data[i].repoName;
    tmp_item.type = "pie";
    tmp_item.label = { show: false, position: "center" };
    tmp_item.itemStyle = { borderRadius: 2 };
    tmp_item.data = [];
    for (let j = 0; j < data[i].data.length; j++) {
      let tmp = {};
      tmp.value = data[i].data[j].value;
      tmp.name = data[i].repoName + "-" + data[i].data[j].name;
      tmp_sum += data[i].data[j].value;
      tmp_item.data.push(tmp);
    }
    if (i === 0) {
      tmp_item.radius = ["65%", "100%"];
    } else {
      tmp_item.radius = ["25%", "60%"];
    }
    series_items.push(tmp_item);
    sum.push(tmp_sum);
  }

  const exportData = () => {
    // export csv data
    let csv_data = "";
    let headers = "";
    let values = "";
    let percents = "";
    for (let i = 0; i < data.length; i++) {
      let repo_name = data[i].repoName;
      for (let j = 0; j < data[i].data.length; j++) {
        headers = headers + repo_name + "-" + data[i].data[j].name;
        values = values + data[i].data[j].value;
        percents = percents + (data[i].data[j].value / sum[i]) * 100 + "%";
        if (j === data[i].data.length - 1) {
          continue;
        }
        headers += ",";
        values += ",";
        percents += ",";
      }
    }
    csv_data = headers + "\r\n" + values + "\r\n" + percents;
    //console.log(csv_data);
    const blob = new Blob([csv_data], {
      type: "text/plain; chartset=utf-8",
    });
    FileSaver.saveAs(blob, "raw-data-" + id + ".csv");
  };
  const initChart = () => {
    let element = document.getElementById(id);
    let myChart = eCharts.init(element);
    const option = {
      legend: {
        type: "scroll",
        x: "right",
        bottom: "20px",
        orient: "vertical",
      },
      itemStyle: {
        borderRadius: 2,
      },
      roseType: "radius",
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
          myExportCSV: {
            show: true,
            title: "export csv data",
            icon:
              "path://M863.2 315.8c-0.2-1.4-0.4-2.6-0.8-4-1.5-5.5-3.9-10.6-7.8-14.5l-128-128c-6-6-14.1-9.4-22.6-9.4L320 159.9c-8.5 0-16.6 3.4-22.6 9.4l-128 128c-3.9 3.9-6.3 9-7.8 14.5-0.4 1.4-0.6 2.6-0.8 4-0.2 1.4-0.8 2.7-0.8 4.2l0 451.8c0 50.8 41.4 92.2 92.2 92.2l519.5 0c50.9 0 92.2-41.4 92.2-92.2L863.9 320C864 318.5 863.4 317.3 863.2 315.8zM333.2 224l357.5 0 64 64L269.2 288 333.2 224zM800 771.8c0 15.6-12.7 28.2-28.2 28.2L252.2 800c-15.6 0-28.2-12.7-28.2-28.2L224 352l576 0L800 771.8z",
            onclick: function () {
              exportData();
            },
          },
        },
        bottom: "-2%",
      },
      series: series_items,
    };
    option && myChart.setOption(option, true);
    window.addEventListener("resize", function () {
      myChart.resize();
    });
  };

  useEffect(() => {
    initChart();
  });

  return <div id={id} style={{ width: "100%", height: "100%" }} />;
};

PieChart.propTypes = {
  data: PropTypes.object,
};

export default PieChart;
