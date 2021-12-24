import React, { useEffect } from "react";
import { nanoid } from "nanoid";
import * as eCharts from "echarts";
import PropTypes from "prop-types";
import FileSaver from "file-saver";

const StackedBarChart = (props) => {
  const { data } = props;
  console.log(data);
  let id = nanoid();
  let series_data = [];
  for (let i = 0; i < data.valueData.length; i++) {
    let item = new Object();
    item.name = data.valueData[i].repo + "-" + data.valueData[i].name;
    item.type = "bar";
    item.stack = data.valueData[i].repo;
    item.emphasis = { focus: "series" };
    item.data = data.valueData[i].detailData;
    item.large = true;
    series_data.push(item);
    console.log(item);
  }

  const exportData = () => {
    let csv_data = "";
    let headers = "repo-name";
    let values = "";
    for (let i = 0; i < data.categoryData.length; i++) {
      headers = headers + "," + data.categoryData[i];
    }
    for (let i = 0; i < data.valueData.length; i++) {
      let value = "";
      value = value + data.valueData[i].repo + "-" + data.valueData[i].name;
      for (let j = 0; j < data.valueData[i].detailData.length; j++) {
        value = value + "," + data.valueData[i].detailData[j];
      }
      values = values + value + "\r\n";
    }
    csv_data = headers + "\r\n" + values;
    const blob = new Blob([csv_data], {
      type: "text/plain; chartset=utf-8",
    });
    FileSaver.saveAs(blob, "raw-data-" + id + ".csv");
  };

  const initChart = () => {
    let element = document.getElementById(id);
    let myChart = eCharts.init(element);
    const option = {
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: false,
          },
          saveAsImage: {
            pixelRatio: 2,
          },
          myExportData: {
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
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        type: "scroll",
        x: "center",
        y: "top",
        orient: "horizontal",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      dataZoom: [
        {
          type: "inside",
        },
        {
          type: "slider",
        },
      ],
      xAxis: [
        {
          type: "category",
          data: data.categoryData,
          silent: false,
          splitLine: {
            show: false,
          },
          splitArea: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          splitArea: {
            show: false,
          },
        },
      ],
      series: series_data,
    };
    option && myChart.setOption(option, true);
    window.addEventListener("resize", function () {
      myChart.resize();
    });
  };

  useEffect(() => {
    initChart();
  }, []);

  return <div id={id} style={{ width: "100%", height: "100%" }} />;
};

StackedBarChart.propTypes = {
  data: PropTypes.object,
};

export default StackedBarChart;
