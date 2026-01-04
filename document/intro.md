**gene-event-handler**（上也被稱為 **geneEH**）是一個基於 **jQuery** 的 JavaScript 工具庫，其核心設計理念為「**行為可由基因控制 (Behavior can be controlled by genes)**」。

以下是該工具的主要特點與使用介紹：

### 1. 核心概念與依賴
*   **行為驅動：** 它允許開發者透過 HTML 標記（Markup）來定義元素的行為，將邏輯封裝在所謂的「基因（genes）」中。
*   **主要依賴：** 該工具庫高度依賴 **jQuery** 環境。
*   **安裝方式：** 支援透過 **Bower** 安裝，指令為 `bower install gene-event-handler`。

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
*   **JavaScript 初始化：** 在文件準備就緒後調用初始化函式：
    ```javascript
    var gee = gee || $.fn.gene;
    $(document).ready(function() {
      gee.init();
    });
    ```
    這會掃描頁面上的 `gee` 元素並啟動對應的邏輯。

### 3. 開發與專案結構
*   **語言組成：** 該專案主要由 **JavaScript (78.7%)** 與 **HTML (21.1%)** 組成。
*   **開發工具：** 使用 **Gulp** 作為建構工具。開發者可以使用 `gulp serve` 進行預覽，或使用 `gulp` 進行生產環境打包。

---

**類比理解：**
使用 **gene-event-handler** 就像是在編寫**生物的 DNA**。HTML 元素是生物體，而 `data-gene` 屬性則是寫在細胞裡的遺傳指令。當 `gee.init()` 這個「生命的引擎」啟動時，它會讀取這些指令，讓按鈕知道自己該具備「提交表單」或是「彈出視窗」的生物本能，而不需要開發者為每個元素手動撰寫重複的行為邏輯。