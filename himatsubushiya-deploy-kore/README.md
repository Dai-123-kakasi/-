# 暇つぶし屋（公開用フォルダ）

このフォルダをそのままVercelにデプロイすると、「AI上司」機能も含めて
インターネット上に公開できます。

```
himatsubushiya-deploy/
├── index.html      ← サイト本体
├── api/
│   └── boss.js      ← AI上司のサーバー側処理（APIキーはここだけで使う）
├── package.json
└── README.md
```

## デプロイ手順（Vercel／無料枠でOK）

1. https://vercel.com にアクセスし、GitHubアカウントなどでサインアップ
2. このフォルダをそのままGitHubリポジトリにアップロード
   （またはVercel CLIを使うなら、このフォルダ内で `vercel` コマンドを実行してもOK）
3. Vercelの管理画面で「New Project」→ 今作ったリポジトリを選択
4. デプロイ設定はデフォルトのままで問題ありません（Framework: Other でOK）
5. デプロイ前に「Environment Variables」で以下を追加
   - Key: `ANTHROPIC_API_KEY`
   - Value: 自分のAnthropic APIキー（console.anthropic.com で発行）
6. Deployを押す → 数十秒でURLが発行されます

これで発行されたURLをそのまま人に送れば、サンドバッグくん・絶対に押すな・
クズ度診断・AI上司、全部そのまま動きます。

## 注意点

- `ANTHROPIC_API_KEY` は絶対に `index.html` やクライアント側のコードに
  書かない。書くと誰でもそのキーを盗んで使えてしまいます。
  このフォルダの構成なら、キーは `api/boss.js`（サーバー側）だけに置かれるので安全です。
- AI上司はAPIを呼ぶたびに料金が発生します（Claude Sonnet 5でごく短い
  やり取りなら1回あたり非常に少額ですが、無制限に公開すると誰かに
  連打されて費用がかさむ可能性はあります）。アクセスが増えてきたら
  簡単なレート制限（例：同じ人が1分に送れる回数を制限する）を
  追加することをおすすめします。
- `api/boss.js` の中の `SYSTEM_PROMPT` を書き換えれば、AI上司のキャラクターや
  口調を自由に変えられます。
