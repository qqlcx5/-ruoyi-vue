# 管理端前端

- 运行

```bash
pnpm dev
```

### Git 提交规范

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` 增加新功能
  - `fix` 修复问题/BUG
  - `style` 代码风格相关无影响运行结果的
  - `perf` 优化/性能提升
  - `refactor` 重构
  - `revert` 撤销修改
  - `test` 测试相关
  - `docs` 文档/注释
  - `chore` 依赖更新/脚手架配置修改等
  - `workflow` 工作流改进
  - `ci` 持续集成
  - `types` 类型定义文件更改
  - `wip` 开发中

#### 命名

- 类、接口、枚举使用 PascalCase。
- 函数、属性、本地变量使用 camelCase。
- 全局变量为全大写加下划线，函数内不得有魔法值。
- 非 css、html 尽量不加中杠和下划线。
- 尽可能使用完整的单词拼写命名。
- 文件夹下的内容，文件或文件夹功能、定义、业务逻辑相似重复，使用复数命名。
- 二级文件夹下的文件功能单一，以简略的单数命名，并建立 index.ts 统一导出。
- css 样式命名中，模块名称单词连接以中杠连接。
- 图片素材等以装饰图长方形 banner、标志图 icon、按钮 btn、导航 nav、文字标题 title、背景 bg 为区分前缀。
- 图片素材完整命名规范为{前缀}_{模块}_{状态}命名。


#### 注释

- 为函数、接口、枚举和类使用`/** */`文档注释，功能简单时可以简略为一行，有参数值、有返回值时需要`@param`、`@return`。
- 函数内部使用`//单行注释`、`/* */`多行注释，尽量简练重点。
- 待完善、改进等注释使用`// TODO 注释`。

### 常用公共组件

 组件名 | 说明 | 测试
 --- | ---
 Form | 表单组件
 FormTable | 表格查询组件
 Table | 表格组件
 Dialog | 弹窗组件 | 测试
 XButton | 按钮组件
 Icon | icon组件
 UploadFile | 上传组件
 Editor | 富文本组件