# 公開前チェック。使い方: PowerShellでサイトのフォルダを開き、 ./tools/check.ps1 を実行
# 「要対応」が0件になれば、公開の準備は完了です。

$root = Split-Path -Parent $PSScriptRoot
$issues = New-Object System.Collections.Generic.List[string]

function Read-Utf8($name) { Get-Content -Raw -Encoding UTF8 (Join-Path $root $name) }

$content = Read-Utf8 "content.js"

# 1. 仮の文言（全角カッコで始まる文）が残っていないか。コメント行は除く
$lines = $content -split "`r?`n"
for ($i = 0; $i -lt $lines.Count; $i++) {
  $line = $lines[$i]
  if ($line -match '^\s*//') { continue }
  if ($line -match '"（[^"]*"') { $issues.Add(("content.js " + ($i + 1) + "行目: 仮の文言が残っています → " + $line.Trim())) }
}

# 2. 未設定のURL・ID
if ($content -match 'formspree\.io/f/X+') { $issues.Add("content.js: formspreeEndpoint が未設定です") }
if ($content -match 'youtubeId:\s*"X+"') { $issues.Add("content.js: youtubeId が未設定の作品があります") }
if ($content -match 'github\.com/（') { $issues.Add("content.js: githubRepoUrl が未設定です") }

# 3. 波ダッシュ
foreach ($f in @("index.html","about-this-site.html","content.js","main.js","404.html")) {
  if ((Read-Utf8 $f).Contains([string][char]0x301C) -or (Read-Utf8 $f).Contains([string][char]0xFF5E)) {
    $issues.Add("${f}: 波ダッシュ（〜）が含まれています。「から」に直してください")
  }
}

# 4. OGP画像が絶対URLか（SNS共有のプレビューに必要）
$index = Read-Utf8 "index.html"
if ($index -notmatch 'og:image"\s+content="https://') {
  $issues.Add("index.html: og:image が相対パスです。公開URLに合わせて https:// から始まるURLに直してください（about-this-site.html も同様）")
}

# 5. 必要なファイル
foreach ($f in @("assets/favicon.svg","assets/ogp.png",".nojekyll")) {
  if (-not (Test-Path (Join-Path $root $f))) { $issues.Add("${f} がありません") }
}

if ($issues.Count -eq 0) {
  Write-Host "要対応: 0件。公開できます。" -ForegroundColor Green
} else {
  Write-Host ("要対応: " + $issues.Count + "件") -ForegroundColor Yellow
  $issues | ForEach-Object { Write-Host (" - " + $_) }
}
