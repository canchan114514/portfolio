# かんちゃんのポートフォリオサイト 更新ガイド

このサイトは、**`content.js` だけを編集すれば**文章も作品も更新できます。HTMLやCSSを触る必要はありません。

## 見た目の確認

`index.html` をダブルクリックしてブラウザで開くだけです。サーバーやインストールは不要です。

## 作品を追加する

1. `content.js` を開く
2. `WORKS` の中の `{ ... }` のかたまり1つ分を丸ごとコピーして、下に貼り付ける（前のかたまりの後ろに `,` が必要です）
3. タイトル、YouTube ID、説明などを書き換える
4. 代表作品（ファーストビューに大きく出す作品）は `featured: true` を1本だけにして、ほかは `false` にする
5. 表示したくない作品は `published: false` にする（下書き）

## 短いサンプルを追加する

15秒程度のテロップ見本やモーショングラフィックスは、作品とは別の「短いサンプル」として載せられます。
`content.js` の `SAMPLES` の中のコメント（`//`）を外して書き換えるだけです。1本も無い間は、サイトに何も表示されません。

## よくある質問を編集する

`content.js` の `SERVICES.faq` に、質問（`q`）と答え（`a`）を1組ずつ書きます。依頼者が迷いやすい点（修正回数、素材の渡し方、BGMなど）を先に答えておくと、問い合わせがしやすくなります。

## YouTube ID の調べ方

動画のURLが `https://www.youtube.com/watch?v=abcDEF12345` なら、`v=` の後ろの11文字（`abcDEF12345`）が ID です。
短縮URL `https://youtu.be/abcDEF12345` なら、最後の11文字です。
動画は「限定公開」でも埋め込み再生できます（「非公開」は不可）。

## お問い合わせフォーム（Formspree）の設定

1. https://formspree.io で無料アカウントを作る
2. 新しいフォームを作ると、`https://formspree.io/f/xxxxxxxx` という形のURLが発行される
3. そのURLを `content.js` の `formspreeEndpoint` に貼る
4. サイトを公開してテスト送信し、自分のメールに届くことを確認する（初回は確認メールが届く場合があります）

設定するまでは、送信ボタンが無効になり「準備中」と表示されます。

## 公開する（GitHub Pages）

1. GitHubで新しいリポジトリを作り、このフォルダの中身をアップロード（またはgit push）する
2. リポジトリの Settings → Pages を開く
3. Source を「Deploy from a branch」、Branch を `main` / `(root)` にして保存
4. 数分後、`https://（ユーザー名）.github.io/（リポジトリ名）/` で表示される

更新するときは、`content.js` を変更してGitHubに反映（コミットしてpush）するだけです。

## 公開前チェック

PowerShellでこのフォルダを開き、次を実行します。仮の文言の残り、未設定のID、波ダッシュなどを一覧にしてくれます。

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\check.ps1
```

「要対応: 0件」になれば準備完了です。

## SNSで共有したときの画像（OGP）

LINEやXでURLを貼ったときに画像を出すには、`index.html` と `about-this-site.html` の `og:image` を、公開URLから始まる形に直します。

```html
<meta property="og:image" content="https://（ユーザー名）.github.io/（リポジトリ名）/assets/ogp.png">
```

## 公開後にやること

1. Formspreeを設定して、テスト送信で確認する
2. 作品をYouTubeにアップロードし、IDを `content.js` に入れる
3. 市販の曲を使っている作品は、フリー音源に差し替えた公開用バージョンを用意する（著作権の申し立てで埋め込み再生が止まることがあります）
4. キャッチコピー、自己紹介、作品説明、「このサイトについて」の文章を埋める
5. `githubRepoUrl` を実際のリポジトリURLに直す
6. 公開URLを履歴書、職務経歴書、クラウドワークスのプロフィールに記載する

## ファイル構成

| ファイル | 役割 |
|---|---|
| `index.html` | トップページ |
| `about-this-site.html` | このサイトについて |
| `content.js` | 文章と作品情報（編集するのはここだけ） |
| `main.js` | content.js を読んで画面を作る処理 |
| `style.css` | 見た目 |
| `assets/` | アイコンとSNS共有用画像 |
| `404.html` | ページが見つからないときの表示 |
| `tools/check.ps1` | 公開前チェック |
| `CLAUDE.md` | Claude Code に読ませるメモ（守るルール） |
