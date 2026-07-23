# 查询指定消费者

## 接口信息

- **URL**: `/v1/consumers/{name}`
- **方法**: `GET`
- **描述**: 根据消费者名称查询单个消费者的详细信息。

## 请求参数

### Path 参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | String | 是 | 消费者名称，不可为空 |

## 响应结构

成功时返回 `Response<Consumer>`：

| 字段 | 类型 | 说明 |
|------|------|------|
| success | Boolean | 是否成功 |
| message | String | 错误信息 |
| data | Consumer | 消费者详情 |

### Consumer 结构

| 字段 | 类型 | 说明 |
|------|------|------|
| name | String | 消费者名称 |
| credentials | List\<Credential\> | 消费者凭证列表 |

### Credential 结构

| 字段 | 类型 | 说明 |
|------|------|------|
| type | String | 凭证类型 |
| source | String | 凭证来源：`BEARER` / `HEADER` / `QUERY` |
| key | String | 凭证 Key（`HEADER` 或 `QUERY` 时有值） |
| values | List\<String\> | 凭证值列表 |

## 响应示例

### 成功响应

```json
{
  "success": true,
  "message": null,
  "data": {
    "name": "my-consumer",
    "credentials": [
      {
        "type": "key-auth",
        "source": "BEARER",
        "key": null,
        "values": ["sk-abc123def456"]
      }
    ]
  }
}
```

### 消费者不存在（404 Not Found）

```json
{
  "success": false,
  "message": "Consumer not found: unknown-consumer",
  "data": null
}
```

## 错误码

| HTTP 状态码 | 说明 |
|-------------|------|
| 200 | 查询成功 |
| 404 | 指定名称的消费者不存在 |
| 500 | 内部服务错误 |
