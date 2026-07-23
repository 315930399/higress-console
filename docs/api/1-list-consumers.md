# 查询消费者列表

## 接口信息

- **URL**: `/v1/consumers`
- **方法**: `GET`
- **描述**: 分页查询所有消费者（Consumer）列表。

## 请求参数

### Query 参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| pageNum | Integer | 否 | 页码，从 1 开始。不传则返回全部数据。 |
| pageSize | Integer | 否 | 每页条数。不传则返回全部数据。 |

## 响应结构

成功时返回 `PaginatedResponse<Consumer>`：

| 字段 | 类型 | 说明 |
|------|------|------|
| success | Boolean | 是否成功，固定为 `true` |
| message | String | 错误信息，成功时为空 |
| data | List\<Consumer\> | 消费者列表 |
| total | Integer | 总记录数 |
| pageNum | Integer | 当前页码，从 0 开始 |
| pageSize | Integer | 每页条数 |

### Consumer 结构

| 字段 | 类型 | 说明 |
|------|------|------|
| name | String | 消费者名称 |
| credentials | List\<Credential\> | 消费者凭证列表 |

### Credential 结构

| 字段 | 类型 | 说明 |
|------|------|------|
| type | String | 凭证类型，当前支持 `key-auth` |
| source | String | 凭证来源：`BEARER` / `HEADER` / `QUERY` |
| key | String | 凭证 Key，`source` 为 `HEADER` 或 `QUERY` 时填写 |
| values | List\<String\> | 凭证值列表 |

## 响应示例

### 成功响应

```json
{
  "success": true,
  "message": null,
  "data": [
    {
      "name": "my-consumer",
      "credentials": [
        {
          "type": "key-auth",
          "source": "BEARER",
          "key": null,
          "values": ["abc123", "def456"]
        }
      ]
    }
  ],
  "total": 1,
  "pageNum": 1,
  "pageSize": 10
}
```

### 错误响应

```json
{
  "success": false,
  "message": "com.alibaba.higress.sdk.exception.BusinessException: ...",
  "data": null
}
```

## 错误码

| HTTP 状态码 | 说明 |
|-------------|------|
| 200 | 查询成功 |
| 500 | 内部服务错误 |
