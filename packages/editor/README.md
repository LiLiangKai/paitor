# editor

文本块编辑器

组成：
- 工具栏
- 块内容：包含文本内容编辑块，块工具栏
- 编辑模式与只读模式

块内容
- 标题
- 段落
- 代码块
- 列表
- 表格
- 图片

行内容
- 高亮标记
- 加粗
- 链接
- 斜体
- 内联代码

数据结构：以json格式描述文本块内容
```json
{
  "title": "标题",
  "content": [
    {
      "id": "1000",
      "type": "heading",
      "level": 1,
      "text": ["标题1"]
    },
    {
      "id": "1001",
      "type": "paragraph",
      "text": ["段落内容"]
    }
  ],
  "version": "1.0.0"
}
```
