# Clouding - 图表数据格式 v1

collected by wxb



## 1. 基础柱状图 BarChart

组件名：`Barchart`

调用方法：要在父组件指定`width` 和 `height`的具体大小

```jsx
import BarChart from "../../componenet/BarChart";

<div style={{width: "350px", height: "300px"}}>
  <BarChart data={data}/>
</div>
```

数据格式：object

```js
data = {
  categoryData: [ // 数据x轴标签，日期
    "yy-mm-dd",
  ],
  valueData: [    // 数据y轴 值，数字
    value,
  ],
}
```

```jsx
data = {
  categoryData: [
    "2021-09-08",
    "2021-10-09",
    "2021-11-10",
  ],
  valueData: [1, 2, 3],
}
```

后续扩展：父组件需要传入图表数据类型，如 commit / issue / merge 等，用于区分柱状图的颜色。会增加一个枚举类的 props 来实现该功能。



## 2. 堆叠柱状图 StackedBarChart

组件名：`StackedBarChart`

调用方法：要在父组件指定`width` 和 `height`的具体大小

```jsx
import StackedBarChart from "../../componenet/StackedBarChart";

<div style={{width: "350px", height: "300px"}}>
  <StackedBarChart data={data}/>
</div>
```

数据格式：object

```jsx
data = {
  categoryData: ["yy-mm-dd"], // x轴标签，日期
  valueData: [
    { repo: "Jyj/BaiCaoJian", name: "item-name", detailData: [value1, value2, value3] }, // y轴对应的数据
  ],
}
```

```jsx
data = {
  categoryData: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  valueData: [
    { repo: "Jyj/BaiCaoJian", name: "commit", detailData: [30, 20, 17, 29, 30, 18, 35] },
    { repo: "Jyj/BaiCaoJian", name: "issue", detailData: [20, 10, 7, 9, 3, 8, 5] },
    { repo: "Jyj/BaiCaoJian", name: "pull request", detailData: [10, 20, 7, 9, 13, 18, 25] },
  ],
}
```

支持多个仓库（不限制个数）堆叠显示，每一个仓库将作为一个柱子，由commit、pull request 等项组成



## 3. 饼状图 PieChart

组件名：`PieChart`

使用方法：要在父组件指定`width` 和 `height`的具体大小

```jsx
import PieChart from "../../componenet/PieChart";

<div style={{width: "350px", height: "300px"}}>
  <PieChart data={data}/>
</div>
```

数据格式：List

```jsx
data = [
  {
    repoName: "repo-name",
    data: [
      { value: val, name: "item-name" }, 
    ]
  },
]
```

```jsx
data = [
  {
    repoName: "BAICAOJIAN",
    data: [
  	  { value: 300, name: "Fine" },
  	  { value: 1300, name: "Goodgood" },
  	  { value: 800, name: "Kathleen" },
  	  { value: 300, name: "Rainy" },
  	  { value: 500, name: "Kathbaby" },
	],
  },
]
```



## 4. 折线图 LineChart

组件名：`LineChart`

使用方法：要在父组件指定`width` 和 `height`的具体大小

```jsx
import LineChart from "components/Charts/LineChart";
<div style={{width: "350px", height: "300px"}}>
  <LineChart data={data}/>
</div>
```

数据格式：object （与 StackedBarChart 基本相同，多了一个smoothOrNot 的布尔变量）

```jsx
data = {
  categoryData: ["yy-mm-dd"], // x轴标签，日期
  valueData: [
    { repo: "Jyj/BaiCaoJian", name: "item-name", detailData: [value1, value2, value3] }, // y轴对应的数据
  ],
  smoothOrNot: true, // true: 平滑曲线；false: 折线
}
```

```jsx
data = {
  categoryData: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  valueData: [
    { repo: "Jyj/BaiCaoJian", name: "commit", detailData: [30, 20, 17, 29, 30, 18, 35] },
    { repo: "Jyj/BaiCaoJian", name: "issue", detailData: [20, 10, 7, 9, 3, 8, 5] },
    { repo: "Jyj/BaiCaoJian", name: "pull request", detailData: [10, 20, 7, 9, 13, 18, 25] },
  ],
  smoothOrNot: true,
}
```



## 5. 数据表格 TablePro

组件名：`TablePro`

使用方法：直接调用即可

```jsx
import TablePro from .. ;
<TablePro data={{data}} />
```

数据格式：object

要求的数据比较多，考虑到 Dashboard 展示 contributor 信息和 customizationList 页面展示自定义的信息展示都要用到，所以除了数据外还需要传入对应数据域的列宽width

```jsx
data = {
  // column: array, 每个item是一个object，存放一列的表格信息
  columns: [ // 通常包括field(域名)，headerName(显示的表头名), width(列宽)
    { field: "id", headerName: "ID", width: 90 },
    { field: "repoName", headerName: "Repo Name", width: 200 },
    { field: "address", headerName: "Repo Address", width: 200 },
    { field: "favorTime", headerName: "Favor Time", width: 150 },
  ],
  // rows: array, 每个item是一个object，存放自定义的dashboard的信息
  rows: [ // 每个item的key值要与column中的field相对应
    {
      id: 1,
      repoName: "JYJ/BaiCaoJian",
      address: "github/JYJ/BCJ",
      favorTime: "yy-mm-dd"
    },
  ],
  pageRows: 5,    // 表示表格一页展示多少条数据
  checkBox: true, // true表示可以勾选
}
```



## 补充 Addition

尺寸：要调整图标大小直接修改父组件的内联style即可

配色：在图表功能全部完善以后再重新配色

Resize：后续会增加需要传入的`props`，会增加一个布尔变量来判断是否要放大

