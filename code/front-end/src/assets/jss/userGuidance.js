const userGuidance = {
  English: {
    welcome:
      "First of all, you are very welcome to become a user of our product Clouding. The following is our user manual. Before using this product, you can increase your understanding of Clouding by reading the user manual.",
    basic:
      "Clouding is a visualization software for the development process of open source projects. Only open source projects on GitHub are currently supported. Only need to provide a legal warehouse address, we can present the project commit pull request issue and contributor information for you, and present it in the form of bar chart, line chart, pie chart, table, etc.",
    login:
      "In the upper right corner of the page, you can find a user icon. Click the icon and select the 'LOGIN' menu below, there will be a login popup window. Register, modify password, and forget the password panel can also be switched in this pop-up window. Each user registration requires an unbound email address. After entering a valid email address, click Send verification code, and our system will send a registration verification code to your email address. You need to enter the correct verification code in the verification code field to complete the registration.",
    import:
      "First, select 'Dashboard' in the sidebar to jump to the dashboard page. Enter the warehouse address you want to import in the input box at the top of the page. Note that you need to use the address starting with https. Click 'ADD' after input, the background will automatically query the data of the warehouse, if the data of the warehouse is not stored, it will be crawled. Crawling takes a long time, so you can do other things first.",
    show:
      "After importing the repositories, you can check one or more repositories, and check the information you want to display in the data information column, click 'SHOW', and the figures will be automatically displayed. The figures in each card support custom chart types, and each item in the table supports sorting in ascending and descending order.",
    dashboard:
      "First, you need to log in to your account. You can freely select the data type and icon type you want to display. After completion, click the 'CUSTOMILIZATION' button at the bottom right of the webpage, and your customized dashboard will be saved in the background.",
    favor:
      "First, you need to log in to your account. After the picture is displayed, you can click the 'FAVOR' button at the bottom right of the page to bookmark the current warehouse. After that, you can view it on the CUSTOMILIZATION page.",
  },
  Chinese: {
    welcome:
      "首先，非常欢迎您成为我们的产品云钉的用户，以下是我们的用户手册，在使用本产品前，您可以通过阅读用户手册增加对云钉的了解。",
    basic:
      "云钉是一款针对于开源项目的开发进程可视化软件。当前仅支持 GitHub 上的开源项目。只需要提供一个合法的仓库地址，我们便可以为您呈现该项目 commit pull request issue 以及contributor 等的信息，并以柱状图、折线图、饼状图、表格等的形式呈现。",
    login:
      "在网页的右上角，您可以找到一个用户图标。点击该图标，并选中下方的 'LOGIN' 菜单，将会有一个登录弹窗。注册、修改密码、忘记密码面板也都可以在该弹窗中切换。每个用户注册需要一个未绑定云钉的邮箱。在输入了合法的邮箱后，点击发送验证码，我们的系统将会给您的邮箱发送注册验证码，您需要在验证码一栏输入正确的验证码，才能够完成注册。",
    import:
      "首先，在侧边栏选中 'Dashboard'，跳转到仪表盘页面。在页面上方的输入框中输入您想要导入的仓库地址，注意，您需要使用 https 开头的地址。输入后点击 'ADD'，后台将自动查询该仓库的数据，若未存储该仓库的数据，则将进行爬取。爬取耗时较长，您可以先去做其他的事。",
    show:
      "导入仓库以后，您可以勾选一个或多个仓库，并在数据信息一栏勾选想要展示的信息，点击 'SHOW'，图标将自动显示。每一张卡片中的图标都支持自定义图表类型，表格的每一项都支持升降序排序。",
    dashboard:
      "首先，您需要登录账号。您可以自由地选取想要展示的数据类型、图标类型，完成后，点击网页右下方的 'CUSTOMILIZATION' 按钮，后台将保存您的定制仪表盘。",
    favor:
      "首先，您需要登录账号。您可以在图片显示以后，点击网页右下方的 'FAVOR' 按钮，对当前的仓库进行收藏。之后，您可以在 CUSTOMILIZATION 页面进行查看。",
  },
};

export default userGuidance;
