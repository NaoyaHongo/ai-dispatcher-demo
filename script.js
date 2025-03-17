// DOM要素の取得
const initialScreen = document.getElementById('initial-screen');
const conversationScreen = document.getElementById('conversation-screen');
const resultScreen = document.getElementById('result-screen');
const startConversationBtn = document.getElementById('start-conversation');
const endConversationBtn = document.getElementById('end-conversation');
const restartDemoBtn = document.getElementById('restart-demo');
const callDurationEl = document.getElementById('call-duration');

// 通話時間用の変数
let callInterval;
let seconds = 0;
let callActive = false;

// ドキュメント読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    // 初期化処理
    resetDemo();
    
    // イベントリスナーの追加
    startConversationBtn.addEventListener('click', () => {
        showScreen(conversationScreen);
    });

    endConversationBtn.addEventListener('click', () => {
        showScreen(resultScreen);
    });

    restartDemoBtn.addEventListener('click', () => {
        resetDemo();
    });
    
    // UI操作用のボタン
    setupActionButtons();
});

// 通話時間の更新関数
function updateCallDuration() {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    callDurationEl.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// デモのリセット
function resetDemo() {
    // タイマーをリセット
    if (callInterval) {
        clearInterval(callInterval);
        callActive = false;
    }
    
    // 初期画面を表示
    showScreen(initialScreen);
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

    // 通話画面の場合、タイマー開始
    if (screen === conversationScreen) {
        if (callActive) {
            clearInterval(callInterval);
        }
        callActive = true;
        seconds = 0;
        callDurationEl.textContent = '00:00';
        callInterval = setInterval(updateCallDuration, 1000);
    } 
    // それ以外の画面の場合、タイマー停止
    else if (callActive) {
        clearInterval(callInterval);
        callActive = false;
    }
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