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

## 部署

### 数据库

- pgvector/pgvector:pg17
- username:
- password:

## 参考

- <https://lobehub.com/zh/docs/self-hosting/server-database/docker-compose>
