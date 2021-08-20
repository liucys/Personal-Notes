#### 1.将平面数组对象转为树形结构

```javascript
// 平面数组转为树形结构
function getTransformTree(list) {
  if (!list || !Array.isArray(list)) return;
  const result = [];
  // 根据id分类数据
  const map = list.reduce((res, v) => ((res[v.id] = v), res), {});
  for (const item of list) {
    // 如果不存在父级id(就是顶级)
    if (!item.parentId) {
      result.push(item);
      continue;
    }
    // 如果项的父级id在map中
    if (item.parentId in map) {
      // 获取出该父级项
      const parent = map[item.parentId];
      // 将项添加到父项下面
      parent.children = parent.children || [];
      parent.children.push(item);
    }
  }
  return result;
}
```

需要转换的数据格式(id 和 parentId 属性应该是必须属性)

```javascript
const data = [
  {
    id: "z234s-sd232-dd423",
    title: "中国xxxx有限公司",
    parentId: "",
  },
  {
    id: "gsd23-dds31-dll42",
    title: "中国yyy有限公司",
    parentId: "z234s-sd232-dd423",
  },
  {
    id: "fj873-ops23-ys7ds",
    title: "福建xxx有限公司",
    parentId: "z234s-sd232-dd423",
  },
  {
    id: "gy023-87sd2-33dw2",
    title: "四川xxxx有限公司",
    parentId: "gsd23-dds31-dll42",
  },
];
```

#### 2.为平面数组对象根据最近的 level 判断其父级

```javascript
/**根据当前数据的level等级与最靠近的上一级level划分父级
 */
function setCompanyParentId(companys) {
  const levels = {};
  // 根据层级划分公司
  companys.map((item) => {
    levels[item.level] = levels[item.level] || [];
    if (!levels[item.level].includes(item)) {
      levels[item.level].push(item);
    }
  });
  //
  Object.getOwnPropertyNames(levels).forEach((level) => {
    levels[level].map((item) => {
      // 当前层级当前公司的下标(需要获取它的上级公司)
      const mark = companys.indexOf(item);
      // 根据当前层级当前公司的下标遍历所有公司
      for (let i = 0; i < mark; i += 1) {
        if (companys[i].level === companys[mark].level - 1) {
          companys[mark].parentId = companys[i].id;
        }
      }
    });
  });
}
```

需要转换的数据格式(数组对象的 level 应该是连续的情况,不能出现越级:如 [{leve:2},{level:4}],不能出现这种情况)

```javascript
const data = [
  {
    name: "中国xx集团有限公司",
    level: 2,
    id: "67a32599-b875-4ac1-abee-d3ab736799ce",
  },
  {
    name: "中国xxx造纸研究院有限公司",
    level: 3,
    id: "5d70c692-a95f-11e9-a538-191480ce8650",
  },
  {
    name: "北京xx物业管理有限公司",
    level: 4,
    id: "67034152-e8b4-4c72-961d-0b4d60acd62f",
  },
  {
    name: "中国dd集团有限公司",
    level: 2,
    id: "79b32599-b875-4ac1-abee-d3ab736799ap",
  },
  {
    name: "中国yy有限公司",
    level: 3,
    id: "48k2599-b875-4ac1-abee-d3ab736762od",
  },
];
```

#### 3.为树形结构数据的每个节点统计其所拥有的子孙节点数量

```javascript
// 统计各节点的子节点数量
function getTreeChildCount(data = [], countField = "childCount") {
  return data.reduce((total, cur) => {
    return (
      total +
      (cur[countField] = getTreeChildCount(cur.children || [], countField))
    );
  }, data.length);
}
```

需要统计子节点数量的树形结构数据类似于

```javascript
const data = [
  {
    id: "67a32599-b875-4ac1-abee-d3ab736799ce",
    title: "中国xx集团有限公司",
    parentId: "",
    children: [
      {
        id: "5d70c692-a95f-11e9-a538-191480ce8650",
        title: "中国xxx造纸研究院有限公司",
        parentId: "67a32599-b875-4ac1-abee-d3ab736799ce",
        children: [
          {
            id: "67034152-e8b4-4c72-961d-0b4d60acd62f",
            title: "北京xx物业管理有限公司",
            parentId: "5d70c692-a95f-11e9-a538-191480ce8650",
          },
        ],
      },
      {
        id: "48k2599-b875-4ac1-abee-d3ab736762od",
        title: "中国yy有限公司",
        parentId: "67a32599-b875-4ac1-abee-d3ab736799ce",
      },
    ],
  },
];
```
