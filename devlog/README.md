# 二次开发记录

## 项目开发

### 本地启动

```
pnpm i
pnpm run dev
```

### 定制

通过 `.env` 定制功能开关

```
FEATURE_FLAGS="-market,-commercial_hide_github,-commercial_hide_docs"
```

- 锁定 “openai=4.89.0” 解决文件向量化的问题

## 部署

### 数据库

- pgvector/pgvector:pg17
- username:
- password:

## 参考

- <https://lobehub.com/zh/docs/self-hosting/server-database/docker-compose>
