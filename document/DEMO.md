# Gene Event Handler Demo 說明

這份文件介紹 `app/index.html` 的示範頁，涵蓋核心 `gee` 行為與掛載方式。

## 如何執行 Demo
- 安裝依賴：`npm install`
- 啟動開發伺服器：`npm run watch`（Parcel 會服務 `app/index.html` 並解析 `src/` 的模組匯入）
- 預設會自動開啟瀏覽器；若沒有，依照終端顯示網址（通常是 `http://localhost:1234`）。

## 頁面如何被綁定
- 入口：`src/index.js` 設定 `window.gee`，配置 `gee.apiUri/subFolder`，並註冊示範自訂元素 `gee-hello`。
- 初始化：`DOMContentLoaded` 時呼叫 `gee.init()`，掃描帶有 `.gee` 的元素，根據 `data-gene` 綁定行為，完成後移除 `.gee` 類別。
- 動態載入：當 `data-gene` 指向尚未註冊的行為時，`gee.load` 會從 `app/scripts/plugins/`（ESM 模組）動態匯入對應檔案。

## 範例區塊（app/index.html）
- **Basic Alert**：`<a class="gee" data-gene="click:alert">` 使用內建 `alert` 行為。
- **Auto Next**：`data-gene="keyup:autoNext"`、`data-ta` 指定下一個輸入；達到 `maxlength` 自動跳轉。實作：`app/scripts/plugins/autoNext.js`；範例片段：`app/scripts/tmpls/sample2.html`。
- **Sync Form**：`data-gene="syncAll"` 把來源表單值複製到 `data-prefix` 前綴的欄位。
- **Custom Element**：`<gee-hello>` 透過 `gee.customElem` 啟動時替換展示。
- **Validation + Submit**：`data-gene="stdSubmit"` 透過 `gee.yell` 送 `FormData`，並用 `src/validatr.js` 驗證；插件：`app/scripts/plugins/stdSubmit.js`。
- **Code Previews**：Prism 透過 `data-src` 載入 `app/scripts/tmpls/*.html` 與 `app/scripts/plugins/*.js` 展示程式碼。

## 延伸技巧
- 在 `app/scripts/plugins/` 新增模組並使用 `gee.hook('behavior', handler, eventType)` 註冊，自動支援 `gee.load` 應用。
- `data-gene="<event>:<behavior>"` 可用逗號分隔多個事件行為；依需求搭配 `data-ta`、`data-prefix`、`data-uri` 等參數。
- 保留 `.gee` 類別以便 `gee.init()` 掃描，綁定後會自動移除以正常顯示。
