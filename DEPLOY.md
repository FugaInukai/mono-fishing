# 起動とVercelへのデプロイ

## ローカル（このPC）

PowerShellで次を実行します。

```powershell
cd C:\Users\fuga2\Documents\Codex\2026-10-14\ge-2\outputs\mono-fishing
node server.mjs
```

ブラウザーで http://localhost:3210/ を開きます。ターミナルを閉じるか `Ctrl+C` で終了します。このPCにはNode.jsが用意されているため、追加インストールは不要です。Node.jsがPATHにない場合は `start.ps1` 内のCodex同梱Node.jsへのフォールバックを利用できます。

別のPCではGitHubからcloneまたはZIPを展開し、Node.js 20以上を用意して、同じく `node server.mjs` を実行します。追加のnpmパッケージはありません。`npm` が利用できる環境なら `npm start` でも起動できます。

## Vercel

Vercel版では、常駐プロセスのメモリーとローカルファイルの代わりに **Upstash Redis** に進行状況を保存します。ブラウザーは約1.5秒間隔で仲間の情報を取得します。ローカル版は引き続きSSE同期と `save/players.json` を使います。

1. Vercelにログインして、Vercel対応コードが入ったGitHubブランチからプロジェクトをImportします。
2. Framework Presetは **Other**、Root Directoryはリポジトリのルート。`vercel.json` のビルド・出力設定を使用します。
3. VercelのStorage / Marketplaceから **Upstash Redis** を接続します。外部DBアカウント、利用規約、料金プランの選択が求められた場合は所有者が確認してください。
4. プロジェクトのEnvironment Variablesに次の2項目が設定されていることを確認します。

```text
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

接続によって `KV_REST_API_URL` / `KV_REST_API_TOKEN` が作られた場合も対応しています。値はGitHubやブラウザー配信用ファイルに書き込まず、Vercelの環境変数だけに設定します。

5. Deployを実行します。環境変数を後から追加した場合はRedeployします。
6. 発行されたURLで入場・釣り・再読み込み後のデータ保持を確認し、別ブラウザーでも同じ合言葉で入場して同期を確認します。

**現在の検証範囲：** ローカルHTTPとVercel用API・Redis通信のテスト用実装による検証、および静的ファイルのビルド。実アカウントへのVercelデプロイと実Redisへの接続は、アカウント設定が完了するまで未検証です。

## データと公開範囲

- ローカルとクラウドの保存先・プレイヤーは別です。ローカルの保存データは自動アップロードしません。
- Vercel用ビルドはブラウザー用8ファイルと `runtime.json` だけを `public/` にコピーします。`save/`、サーバーソース、環境変数は静的配信に含めません。
- プレイヤー更新はRedisの比較・交換を使い、同時購入や引き上げの二重報酬を防ぎます。
- Redis未設定の場合は明示的な接続エラーを返し、一時メモリーへの保存で代用しません。

## 検証

```powershell
node --test test.mjs vercel.test.mjs
node scripts/build.mjs
```

参考：[Vercel Functionsの制約](https://vercel.com/docs/functions/limitations)、[VercelとRedis](https://vercel.com/docs/redis)、[Upstash REST API](https://upstash.com/docs/redis/features/restapi)
