# 數字轉國字大寫工具

_Started 2026-05-15 01:57 UTC_

---

## User

請幫我產生一個數字轉國字大寫(新台幣)的工具網站。參考方向：https://tw.piliapp.com/converter/chinese-numbers/?currency=TWD，但不要複製任何現有網站的品牌、Logo、文案、視覺。要做成一個原創、SEO 友善的線上工具網站。網站名稱暫定：工具網。使用者需求：使用者輸入阿拉伯數字，系統自動轉成中文數字大寫。核心功能需求：首頁核心工具區（輸入框 + 按鈕 + 結果展示）
進階篩選（如果適用）
結果展示要分組、清晰
SEO 內容模組（What is / How to use / Who can use / FAQ）
必備頁面：首頁、關於、聯絡、隱私權政策、服務條款
廣告位預留：工具下方、結果中間、文章中間、側邊欄（移動端隱藏）
行動端優先，響應式佈局
簡潔配色（白底 + 單一主色）

## Assistant

_[tool: list_files]_

_[tool: questions_v2]_

## User

Questions answered:
- primary_color: 3
- tone: 工具感、極簡實用（像 Google 工具）
- font_choice: Noto Serif TC（襯線、文件感、適合金額大寫）
- conversion_features: 自動加「新台幣」「元整」「正」等前後綴, 一鍵複製結果, 整數轉換（基本）
- result_display: 單一主結果 + 下方衍生格式（小寫中文、英文、千分位）
- pages_scope: 首頁完整 + 其他 4 頁簡版
- ads_style: AdSense 標準尺寸 + dashed 框
- seo_content_depth: 標準（What/How/Who/FAQ 各 1 區）
- future_tools: 要，預留 6-8 個其他工具卡片（占位）
- tweaks_wanted: 字體大小可放大
- variation_count: 1 個就好（最有把握的版本）

## Assistant

_[tool: update_todos]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

Now the homepage:

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

Now the four secondary pages:

_[tool: register_assets]_

_[tool: done]_

_[tool: fork_verifier_agent]_

已完成「工具網」整站雛形 🎉 主色磚紅 + Noto Serif TC，行動端優先。

**檔案結構**
- `index.html` — 完整首頁（工具區 → 廣告位 → SEO 內容 → 其他工具卡片）
- `about.html` / `contact.html` / `privacy.html` / `terms.html` — 簡版必備頁
- `converter.js` — 純前端轉換邏輯（整數、負數、最多 16 位數、含千分位、英文）
- `styles.css` / `app.js` — 共用樣式與互動

**主要特點**
- 工具區即時轉換、自動加「新台幣⋯元整」、一鍵複製，下方衍生四種格式（大寫純文字／小寫中文／千分位／英文）
- 範例 chips、錯誤提示、清除按鈕、Enter 觸發
- SEO：title/description/canonical、Schema.org（WebApplication + FAQPage）、語義化 H2、`<details>` FAQ
- 廣告位以 dashed 框 + AdSense 標準尺寸標示（728×90 leaderboard、in-article），側欄已預留 CSS（行動端自動隱藏）
- 6+ 個「即將推出」工具卡占位
- 字級三段切換（A− / A / A+），也透過 Tweaks 面板暴露（小／標準／大／特大）

**可下一步**
- 補小數（角、分）支援
- 串真實聯絡表單後端
- 加 `sitemap.xml` / `robots.txt`
- 把「即將推出」卡片做成獨立工具頁

## User

請幫我完成其他工具頁:折扣與毛利計算機、營業稅／發票試算、民國／西元日期轉換等工具

## Assistant

_[tool: update_todos]_

我來把三個工具一次補完，並更新首頁卡片連結。

_[tool: str_replace_edit]_

First, add shared styles for tabs/multi-field inputs that all three tools will use:

_[tool: write_file]_

_[tool: write_file]_

Now the three tool pages. Each follows the same chrome + SEO structure as index.html:

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

Now the date converter:

_[tool: str_replace_edit]_

Now update the homepage cards — make the three new tools clickable and active:

_[tool: register_assets]_

_[tool: done]_

_[tool: fork_verifier_agent]_

三個工具都上架完成 ✓

**新增頁面**
- `discount.html` — 折扣 / 毛利率（分頁切換）
- `vat.html` — 營業稅 5%（外加 / 內含 雙向）
- `date-converter.html` — 民國 / 西元日期轉換（即時雙向同步 + 中文寫法 + 星期 + 距今天數 + 快捷預設）

**共同特性**
- 與首頁一致的 header / footer / font-size 切換 / 廣告位 / SEO 模組（What / How / Who / FAQ）
- Schema.org WebApplication 結構化資料
- 即時運算（無需按按鈕），純前端、無上傳

**首頁更新**
- 三張卡片從「即將推出」改為可點擊狀態，並補了交叉導流（每個工具頁下方都列出其他三個工具）

**可下一步**
- 補 sitemap.xml / robots.txt
- 加上字數計算、QR Code、匯率等剩餘卡片
- 折扣計算機可加「再折扣」（疊加折扣）模式

## User

Verifier agent check completed

## Assistant

驗證通過 ✅ 三個工具的計算邏輯（折扣、毛利、外加/內含營業稅、閏年判斷、民國/西元換算、中文寫法）全部正確，無 console errors。

## User

為網站加入adsense的代碼:<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7520385754428125"
     crossorigin="anonymous"></script>

## Assistant

_[tool: run_script]_

已將 Google AdSense 代碼加到全部 8 個頁面的 `<head>`（index、about、contact、privacy、terms、discount、vat、date-converter）。

廣告位仍維持原本的 dashed placeholder，方便你之後依各區位實際尺寸（728×90 leaderboard、in-article、300×250 等）放入對應的 `<ins class="adsbygoogle">` 廣告單元。需要我幫你把 placeholder 換成實際 AdSense 廣告單元嗎？只要告訴我每個版位要用哪個 Ad Slot ID 即可。

## User

加入台灣地址中翻英的功能頁

## Assistant

_[tool: write_file]_

我分兩步來做：先建頁面，再加上轉換邏輯與字典。

**Step 1 — 頁面殼**

_[tool: write_file]_

**Step 2 — 轉換邏輯與字典**

_[tool: show_html]_

Quick correctness check on the converter, then update homepage:

_[tool: str_replace_edit]_

_[tool: register_assets]_

_[tool: done]_

_[tool: fork_verifier_agent]_

台灣地址中翻英已上線 ✓

**功能特色**
- 22 縣市 + ~170 鄉鎮市區英文字典（依中華郵政漢語拼音）
- 自動辨識：郵遞區號 / 縣市 / 區 / 路名 / 段 / 巷 / 弄 / 號 / 樓 / 室 / 之N
- 路名包含方向（東路 → E. Rd. / 西街 → W. St.）
- ~80 條常見路名專用拼音（中山 → Zhongshan、忠孝 → Zhongxiao、羅斯福 → Roosevelt 等）
- 罕用字會以 `[字]` 標示提醒手動修正

**範例輸出**
- `100 台北市中正區忠孝東路一段1號5樓之2`
- → `5F.-2, No. 1, Sec. 1, Zhongxiao E. Rd., Zhongzheng Dist., Taipei City 100, Taiwan (R.O.C.)`

**已等驗證代理回報**，待結果出爐我再依錯處微調字典。後續若想擴充，可以給我幾條常用的「公司地址」或你常寄送的目的地，我把字典補齊。

## User

Verifier agent check completed

## Assistant

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

驗證結果好——有一個邊緣案例值得修：「中山一路」目前輸出 `ZhongshanYi Rd.`，應該是 `Zhongshan 1st Rd.`。我來修這個：

_[tool: show_html]_

_[tool: eval_js]_

修好了 ✅ — 「中山一路」現在正確輸出為 `Zhongshan 1st Rd.`，其他案例維持原本的正確輸出。

