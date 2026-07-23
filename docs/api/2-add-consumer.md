# 创建消费者

## 接口信息

- **URL**: `/v1/consumers`
- **方法**: `POST`
- **描述**: 创建一个新的消费者（Consumer），需提供名称和至少一个凭证。

## 请求参数

### Body 参数（JSON）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | String | 是 | 消费者名称，不可为空 |
| credentials | List\<Credential\> | 是 | 凭证列表，至少包含一个 |

### Credential 子结构

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | String | 否 | 凭证类型，默认为 `key-auth` |
| source | String | 是 | 凭证来源，可选值：`BEARER`、`HEADER`、`QUERY` |
| key | String | 条件必填 | 当 `source` 为 `HEADER` 或 `QUERY` 时必填 |
| values | List\<String\> | 是 | 凭证值列表，至少包含一个值 |

### source 说明

| 值 | 说明 | key 是否必填 |
|----|------|-------------|
| BEARER | 使用 `Authorization: Bearer <token>` 请求头 | 否 |
| HEADER | 使用自定义 HTTP Header | 是 |
| QUERY | 使用 URL 查询参数 | 是 |

## 响应结构

成功时返回 `Response<Consumer>`：

| 字段 | 类型 | 说明 |
|------|------|------|
| success | Boolean | 是否成功 |
| message | String | 错误信息 |
| data | Consumer | 创建后的消费者对象 |

## 请求示例

```bash
curl -X POST http://localhost:8080/v1/consumers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-consumer",
    "credentials": [
      {
        "type": "key-auth",
        "source": "BEARER",
        "values": ["sk-abc123def456"]
      }
    ]
  }'
```

## 响应示例

### 成功响应（201 Created）

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

### 校验失败响应（400 Bad Request）

```json
{
  "success": false,
  "message": "name cannot be blank.",
  "data": null
}
```

## 错误码

| HTTP 状态码 | 说明 |
|-------------|------|
| 201 | 创建成功 |
| 400 | 请求参数校验失败（如 name 为空、credentials 为空、source 不合法等） |
| 500 | 内部服务错误 |
