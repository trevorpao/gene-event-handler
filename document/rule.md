# 使用規則

- **載入方式（IIFE）**
  - 引入已建好的 gene.min.js 後，使用全域 `window.gee` / `window.validatr`：
    ```html
    <script src="dist/gene.min.js"></script>
    <script>
      gee.debug = 1;                         // 0 關閉、1 開啟除錯訊息（console）
      gee.apiUri = 'https://api.example.com';// yell 的預設前綴
      gee.subFolder = 'scripts/plugins';     // 未註冊行為的動態載入路徑
      document.addEventListener('DOMContentLoaded', () => gee.init());
    </script>
    ```
- **data-gene 規則**
  - `data-gene="<event>:<behavior>[,event2:behavior2...]"`，預設事件 `click`；`hover` 會展開為 `mouseenter`/`mouseleave`；`init` 立即執行。
  - 初始化後 `.gee` 會被移除；支援舊寫法 `data-event` / `data-behavior`。
- **建議綁定策略**
  - 表單流程：用 `submit:<behavior>` 綁在 `<form>`（涵蓋 Enter / 可存取性）。
  - 按鈕純動作：用 `click:<behavior>`。
- **內建 hooks**
  - `react`, `notfound`, `alert`, `resetForm`, `stdSubmit`（含 `validatr.validateForm` + `gee.yell`，處理 msg/reset/redirect/goback/func）。
- **validatr**
  - API：`validateField` / `validateForm` / `attach` / `addRule`。
  - 預設 inline 錯誤：`.validatr-err`，模板 `<div class="validatr-err">{{message}}</div>`；可設 `showFieldErrors=false` 或覆寫 `errorTemplate/errorClass`。
  - `data-error` 覆蓋訊息；自訂規則需 `data-{rule}` 啟用。
- **yell**
  - `gene.yell(uri, postData, successCB?, errorCB?, typeOrOpts?, hideLoadAnim?)`，回傳 `{ ok, code, data, error, status }`；物件自動 JSON，FormData/Blob 原樣，預設 `credentials: same-origin`、`mode: cors`。
- **自訂元素**
  - `customElem.register(tag, fn, { overwrite, mode })`，預設 `replace`；標記 `data-gee-tagged-{tag}` 避免重複；`customElem.apply` 可重複套用。

