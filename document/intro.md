**gene-event-handler**（geneEH）是一個以原生 DOM 為核心的事件／行為綁定工具，理念是「**行為可由基因控制 (Behavior can be controlled by genes)**」。

以下是主要特點與使用介紹：

### 1. 核心概念與依賴
*   **行為驅動：** 透過 HTML 標記（Markup）宣告元素行為，將邏輯封裝在「基因（genes）」中。
*   **依賴：** 核心不需 jQuery/cash，內建輕量驗證器 validatr；若需要 `$` 相容層請自行引入。
*   **安裝方式：** 推薦 npm (`npm install` / `npm run watch`)，Bower 僅作為 legacy。

### data-gene 速查
* 語法：`data-gene="<event>:<behavior>[,event2:behavior2...]"`；無事件時預設 `click`。
* 支援 `hover` 語義（展開為 `mouseenter` + `mouseleave`）。
* 可搭配 `data-event` / `data-behavior` 舊寫法；初始化時 `.gee` 會被掃描並移除。

#### 範例：以 submit 綁定 sendAction

JavaScript（原生 ESM 入口）：
```javascript
// 若使用打包後的 iife，改成：import './dist/gene.min.js'; const gee = window.gee;
import gee from './src/gene.js';
import './src/base.js';           // 內建 hooks / validatr

// 註冊行為基因
gee.hook('sendAction', function (me) {
  const form = me; // me 是 form
  const msgInput = form.querySelector('#sms-msg');
  const msg = (msgInput?.value || '').trim();
  if (!msg) {
    alert('內容不可為空！');
    return false;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn?.classList.add('is-loading');

  setTimeout(() => {
    submitBtn?.classList.remove('is-loading');
    alert('簡訊發送成功！內容：' + msg);
  }, 1000);

  return false; // 若不想讓瀏覽器實際提交
});

gee.hook('initForm', function () {
  console.log('簡訊發送元件初始化完畢');
});

document.addEventListener('DOMContentLoaded', () => {
  gee.init(); // 掃描 .gee 並綁定對應行為
});
```

HTML（表單 submit 綁定）：
```html
<form class="gee" data-gene="init:initForm,submit:sendAction" novalidate>
  <div class="field is-grouped">
    <p class="control is-expanded">
      <input id="sms-msg" class="input" type="text" placeholder="輸入簡訊內容" required>
    </p>
    <p class="control">
      <button type="submit" class="button is-primary">送簡訊</button>
    </p>
  </div>
</form>
```

### 2. 基本使用流程
根據來源文件，其實作分為三個部分：

*   **CSS 設定（防止閃爍）：** 為了避免頁面載入時尚未處理的元素出現閃爍（Anti Flickering），建議設定 `.gee { display: none; }`。該類別名稱 `gee` 通常與工具庫的行為綁定。
*   **HTML 宣告行為：** 在 HTML 標籤中使用 `data-gene` 來指定行為名稱，並利用 `data-uri` 等屬性傳遞參數。例如：
    ```html
    <button type="button" class="btn gee" data-uri="/invitation/add_new" data-gene="stdSubmit">
      發送邀請
    </button>
    ```
    在此範例中，該按鈕被賦予了 `stdSubmit` 的行為基因。
*   **JavaScript 初始化：** 在 DOM ready 後呼叫：
    ```javascript
    import gee from './scripts/gene.js';
    document.addEventListener('DOMContentLoaded', () => {
      gee.init();
    });
    ```
    會掃描 `.gee` 元素並啟動對應邏輯。

### 3. 開發與專案結構
*   **語言組成：** 該專案主要由 **JavaScript (78.7%)** 與 **HTML (21.1%)** 組成。
*   **開發工具：** 現行使用 Parcel（`npm run watch` / `npm run build`）做開發與打包；舊版 gulp 流程為 legacy。

---

**類比理解：**
使用 **gene-event-handler** 就像是在編寫**生物的 DNA**。HTML 元素是生物體，而 `data-gene` 屬性則是寫在細胞裡的遺傳指令。當 `gee.init()` 這個「生命的引擎」啟動時，它會讀取這些指令，讓按鈕知道自己該具備「提交表單」或是「彈出視窗」的生物本能，而不需要開發者為每個元素手動撰寫重複的行為邏輯。