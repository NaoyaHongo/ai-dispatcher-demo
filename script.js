// DOM要素の取得
const initialScreen = document.getElementById('initial-screen');
const conversationScreen = document.getElementById('conversation-screen');
const resultScreen = document.getElementById('result-screen');
const startConversationBtn = document.getElementById('start-conversation');
const endConversationBtn = document.getElementById('end-conversation');
const restartDemoBtn = document.getElementById('restart-demo');
const authScreen = document.getElementById('auth-screen');
const mainContent = document.getElementById('main-content');

// ドキュメント読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) return;
    
    // 認証成功後にコンテンツを表示
    showMainContent();

    // イベントリスナーの設定
    setupEventListeners();
    
    // 初期画面を表示
    showScreen(initialScreen);
});

// メインコンテンツを表示する関数
function showMainContent() {
    authScreen.style.display = 'none';
    mainContent.style.display = 'block';
}

// イベントリスナーの設定
function setupEventListeners() {
    // 「電話に出る」ボタン
    startConversationBtn.addEventListener('click', () => {
        showScreen(conversationScreen);
    });

    // 「会話結果を見る」ボタン
    endConversationBtn.addEventListener('click', () => {
        showScreen(resultScreen);
    });

    // 「デモをやり直す」ボタン
    restartDemoBtn.addEventListener('click', () => {
        showScreen(initialScreen);
    });
    
    // 質問例のクリックイベント（クリックで次の画面へ）
    const questionExamples = document.querySelectorAll('.example-scenario');
    questionExamples.forEach(example => {
        example.addEventListener('click', () => {
            // 質問をクリックしても結果画面に進む
            showScreen(resultScreen);
        });
    });
}

// 画面切り替え関数
function showScreen(screen) {
    // すべての画面を非表示
    initialScreen.classList.remove('active');
    conversationScreen.classList.remove('active');
    resultScreen.classList.remove('active');

    // 指定された画面のみを表示
    screen.classList.add('active');
    
    // スクロールをトップに戻す
    window.scrollTo(0, 0);
}

// UI操作ボタンのセットアップ
function setupActionButtons() {
    // ミュートボタン
    const muteButton = document.querySelector('.phone-button.mute');
    if (muteButton) {
        muteButton.addEventListener('click', function() {
            this.classList.toggle('active');
            this.style.backgroundColor = this.classList.contains('active') ? '#ff6b00' : '#eee';
            this.style.color = this.classList.contains('active') ? 'white' : 'black';
        });
    }

    // キーパッドボタン
    const keypadButton = document.querySelector('.phone-button.keypad');
    if (keypadButton) {
        keypadButton.addEventListener('click', function() {
            // 簡単なフィードバック
            this.classList.add('active');
            setTimeout(() => {
                this.classList.remove('active');
            }, 300);
        });
    }
}

// 認証チェック
function checkAuth() {
    if (!sessionStorage.getItem('authenticated')) {
        setTimeout(() => {
            const password = prompt('このデモサイトはパスワードで保護されています。\nパスワードを入力してください:');
            if (password === 'route-D') {
                sessionStorage.setItem('authenticated', 'true');
                showMainContent();
                setupEventListeners();
                showScreen(initialScreen);
                return true;
            } else {
                alert('パスワードが正しくありません。');
                window.location.href = 'about:blank';
                return false;
            }
        }, 500); // 少し遅延を入れて、認証画面が確実に表示されるようにする
        return false;
    }
    return true;
} 