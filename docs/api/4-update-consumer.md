# 更新消费者

## 接口信息

- **URL**: `/v1/consumers/{name}`
- **方法**: `PUT`
- **描述**: 更新指定消费者的配置。URL 中的 `name` 与 Body 中的 `name` 必须一致（若 Body 中未传 `name` 则自动使用 URL 中的值）。

## 请求参数

### Path 参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | String | 是 | 消费者名称，不可为空 |

### Body 参数（JSON）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | String | 否 | 消费者名称，不传则使用 URL 中的 name |
| credentials | List\<Credential\> | 是 | 凭证列表，至少包含一个 |

### Credential 子结构

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | String | 否 | 凭证类型，默认为 `key-auth` |
| source | String | 是 | 凭证来源：`BEARER`、`HEADER`、`QUERY` |
| key | String | 条件必填 | 当 `source` 为 `HEADER` 或 `QUERY` 时必填 |
| values | List\<String\> | 否 | 凭证值列表，更新时可不传 |

## 响应结构

成功时返回 `Response<Consumer>`，`data` 字段为更新后的消费者对象。

## 请求示例

```bash
curl -X PUT http://localhost:8080/v1/consumers/my-consumer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-consumer",
    "credentials": [
      {
        "type": "key-auth",
        "source": "HEADER",
        "key": "X-API-Key",
        "values": ["new-key-001"]
      }
    ]
  }'
```

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
        "source": "HEADER",
        "key": "X-API-Key",
        "values": ["new-key-001"]
      }
    ]
  }
}
```

### 名称不一致（400 Bad Request）

```json
{
  "success": false,
  "message": "Consumer name in the URL doesn't match the one in the body.",
  "data": null
}
```

## 错误码

| HTTP 状态码 | 说明 |
|-------------|------|
| 200 | 更新成功 |
| 400 | 参数校验失败（名称不一致、字段为空等） |
| 500 | 内部服务错误 |
