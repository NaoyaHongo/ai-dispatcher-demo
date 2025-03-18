// DOM要素の取得
const initialScreen = document.getElementById('initial-screen');
const conversationScreen = document.getElementById('conversation-screen');
const resultScreen = document.getElementById('result-screen');
const startConversationBtn = document.getElementById('start-conversation');
const endConversationBtn = document.querySelector('.end-call-btn');
const mobileEndConversationBtn = document.getElementById('mobile-end-conversation');
const restartDemoBtn = document.getElementById('restart-demo');
const authScreen = document.getElementById('auth-screen');
const mainContent = document.getElementById('main-content');
const callDurationEl = document.querySelector('.call-duration');

// 通話時間関連の変数
let callDuration = 0;
let callTimer;
let resultScreenTimer; // 結果画面の自動リセット用タイマー
const RESULT_SCREEN_TIMEOUT = 30000; // 30秒後にリセット

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
        startCallTimer();
    });

    // 「通話終了」ボタン（メイン）
    endConversationBtn.addEventListener('click', () => {
        stopCallTimer();
        showScreen(resultScreen);
        startResultScreenTimer(); // 結果画面タイマーを開始
    });
    
    // 「通話終了」ボタン（モバイル用）
    if (mobileEndConversationBtn) {
        mobileEndConversationBtn.addEventListener('click', () => {
            stopCallTimer();
            showScreen(resultScreen);
            startResultScreenTimer(); // 結果画面タイマーを開始
        });
    }

    // 「デモをやり直す」ボタン
    restartDemoBtn.addEventListener('click', () => {
        clearResultScreenTimer(); // タイマーをクリア
        resetCallTimer();
        showScreen(initialScreen);
    });
    
    // 質問例のクリックイベントは削除
    // 質問例は参考表示のみとする
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

// 結果画面の自動リセットタイマーを開始
function startResultScreenTimer() {
    // 既存のタイマーをクリア
    clearResultScreenTimer();
    
    // カウントダウン表示要素があれば初期化
    const countdownEl = document.getElementById('result-countdown');
    if (countdownEl) {
        countdownEl.textContent = '30';
    }
    
    // カウントダウン用の変数とタイマーを初期化
    let secondsLeft = 30;
    let countdownInterval;
    
    // カウントダウン表示用の1秒ごとの更新
    countdownInterval = setInterval(() => {
        secondsLeft--;
        if (countdownEl && secondsLeft >= 0) {
            countdownEl.textContent = secondsLeft.toString();
        }
        
        // 0になったらクリア
        if (secondsLeft <= 0) {
            clearInterval(countdownInterval);
        }
    }, 1000);
    
    // 30秒後に初期画面に戻る
    resultScreenTimer = setTimeout(() => {
        clearInterval(countdownInterval);
        resetCallTimer();
        showScreen(initialScreen);
    }, RESULT_SCREEN_TIMEOUT);
    
    // グローバルスコープに保存して、必要に応じてクリアできるようにする
    window.currentCountdownInterval = countdownInterval;
}

// 結果画面タイマーをクリア
function clearResultScreenTimer() {
    if (resultScreenTimer) {
        clearTimeout(resultScreenTimer);
        resultScreenTimer = null;
    }
    
    // カウントダウンインターバルもクリア
    if (window.currentCountdownInterval) {
        clearInterval(window.currentCountdownInterval);
        window.currentCountdownInterval = null;
    }
    
    // カウントダウン表示をリセット
    const countdownEl = document.getElementById('result-countdown');
    if (countdownEl) {
        countdownEl.textContent = '30';
    }
}

// 通話タイマーを開始
function startCallTimer() {
    callDuration = 0;
    updateCallDuration();
    callTimer = setInterval(updateCallDuration, 1000);
}

// 通話タイマーを更新
function updateCallDuration() {
    callDuration++;
    const minutes = Math.floor(callDuration / 60).toString().padStart(2, '0');
    const seconds = (callDuration % 60).toString().padStart(2, '0');
    callDurationEl.textContent = `${minutes}:${seconds}`;
}

// 通話タイマーを停止
function stopCallTimer() {
    clearInterval(callTimer);
}

// 通話タイマーをリセット
function resetCallTimer() {
    stopCallTimer();
    callDuration = 0;
    if (callDurationEl) {
        callDurationEl.textContent = '00:00';
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