### 根据父节点的id递归查询其所有叶子节点

companies 表结构

| id   | name | parentId |
| ---- | ---- | -------- |
| 1    | 父   | 0        |
| 2    | 子   | 1        |
| 3    | 子   | 1        |
| 4    | 孙   | 3        |
| 5    | 父   | 0        |

查询语句

```
WITH RECURSIVE company AS (
  SELECT 
    * 
  FROM 
    companies 
  WHERE 
    id = '1' 
  union ALL 
  SELECT 
    companies.* 
  FROM 
    companies, 
    company 
  WHERE 
    companies."parentId" = company.id
) 
SELECT 
  * 
FROM 
  company 
ORDER BY 
  name
```

查询结果

| id   | name | parentId |
| ---- | ---- | -------- |
| 1    | 父   | 0        |
| 2    | 子   | 1        |
| 3    | 子   | 1        |
| 4    | 孙   | 3        |

### 根据子节点id递归查询父节点

companies 表结构

| id   | name | parentId |
| ---- | ---- | -------- |
| 1    | 父   | 0        |
| 2    | 子   | 1        |
| 3    | 子   | 1        |
| 4    | 孙   | 3        |
| 5    | 父   | 0        |

查询语句

```
WITH RECURSIVE company AS (
  SELECT 
    * 
  FROM 
    companies 
  WHERE 
    id = '4' 
  union ALL 
  SELECT 
    t.* 
  FROM 
    companies t, 
    company 
  WHERE 
    t.id = company."parentId"
) 
SELECT 
  * 
FROM 
  company 
ORDER BY 
  id
```

查询结果

| id   | name | parentId |
| ---- | ---- | -------- |
| 1    | 父   | 0        |
| 3    | 子   | 1        |
| 4    | 孙   | 3        |

