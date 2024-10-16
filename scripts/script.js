const loginContainer = document.getElementById('loginContainer');
const checkInContainer = document.getElementById('checkInContainer');
const adminContainer = document.getElementById('adminContainer');
const errorMsg = document.getElementById('errorMsg');
const checkInErrorMsg = document.getElementById('checkInErrorMsg');
const checkInStatus = document.getElementById('checkInStatus');
const pointsDisplay = document.getElementById('pointsDisplay');
const userPointsContainer = document.getElementById('userPointsContainer');
const usedCouponsList = document.getElementById('usedCouponsList');

const users = {
    'admin': { password: 'adminpass', role: 'admin', points: 0, usedCoupons: [] },
    'LCM': { password: '1024', role: 'user', points: 0, usedCoupons: [] },
    'CWY': { password: '0926', role: 'user', points: 0, usedCoupons: [] },
    'LKW': { password: '0720', role: 'user', points: 0, usedCoupons: [] },
};

let currentUsername = '';
let currentRole = '';

// 在頁面加載時填入之前儲存的資料
window.onload = function() {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        document.getElementById('loginUsername').value = savedUsername;
    }
};

document.getElementById('loginBtn').addEventListener('click', function() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (users[username] && users[username].password === password) {
        alert("登入成功！");
        currentUsername = username;
        currentRole = users[username].role;
        loginContainer.classList.add('hidden');
        checkInContainer.classList.remove('hidden');

        updatePointsDisplay(); // 更新積分顯示

        if (currentRole === 'admin') {
            adminContainer.classList.remove('hidden');
            displayAllUserPoints(); // 顯示所有用戶積分
        }

        // 儲存用戶名到 localStorage
        localStorage.setItem('username', username);
    } else {
        errorMsg.textContent = "用戶名或密碼錯誤！";
    }
});

document.getElementById('logoutBtn').addEventListener('click', resetLogin);
document.getElementById('adminLogoutBtn').addEventListener('click', resetLogin);

function resetLogin() {
    currentUsername = '';
    currentRole = '';
    loginContainer.classList.remove('hidden');
    checkInContainer.classList.add('hidden');
    adminContainer.classList.add('hidden');
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    checkInStatus.textContent = "";
    userPointsContainer.innerHTML = ""; // 清空用戶積分顯示
    usedCouponsList.innerHTML = ""; // 清空已兌換的禮品顯示

    // 清除 localStorage 中的用戶名
    localStorage.removeItem('username');
}

function updatePointsDisplay() {
    const user = users[currentUsername];
    pointsDisplay.textContent = `當前積分: ${user.points}`;
}
document.getElementById('addUserBtn').addEventListener('click', function() {
    const newUsername = document.getElementById('newUsername').value.trim();
    const newPassword = document.getElementById('newPassword').value;

    if (newUsername && newPassword) {
        if (users[newUsername]) {
            document.getElementById('addUserErrorMsg').textContent = "用戶名已存在！";
        } else {
            users[newUsername] = { password: newPassword, role: 'user', points: 0, usedCoupons: [] };
            document.getElementById('addUserErrorMsg').textContent = "用戶新增成功！";
            document.getElementById('newUsername').value = '';
            document.getElementById('newPassword').value = '';
            displayAllUserPoints(); // 更新用戶積分顯示
        }
    } else {
        document.getElementById('addUserErrorMsg').textContent = "請填寫所有欄位！";
    }
});
// 當管理員登入後顯示用戶選單
function displayUserSelect() {
    const userSelect = document.getElementById('userSelect');
    userSelect.innerHTML = '<option value="">選擇用戶</option>'; // 清空選單

    for (const username in users) {
        const option = document.createElement('option');
        option.value = username;
        option.textContent = username;
        userSelect.appendChild(option);
    }
}

// 新增用戶按鈕事件
document.getElementById('addUserBtn').addEventListener('click', function() {
    const newUsername = document.getElementById('newUsername').value.trim();
    const newPassword = document.getElementById('newPassword').value;

    if (newUsername && newPassword) {
        if (users[newUsername]) {
            document.getElementById('addUserErrorMsg').textContent = "用戶名已存在！";
        } else {
            users[newUsername] = { password: newPassword, role: 'user', points: 0, usedCoupons: [] };
            document.getElementById('addUserErrorMsg').textContent = "用戶新增成功！";
            document.getElementById('newUsername').value = '';
            document.getElementById('newPassword').value = '';
            displayAllUserPoints(); // 更新用戶積分顯示
            displayUserSelect(); // 更新用戶選單
        }
    } else {
        document.getElementById('addUserErrorMsg').textContent = "請填寫所有欄位！";
    }
});

// 刪除用戶按鈕事件
document.getElementById('deleteUserBtn').addEventListener('click', function() {
    const userSelect = document.getElementById('userSelect');
    const usernameToDelete = userSelect.value;

    if (usernameToDelete) {
        delete users[usernameToDelete];
        document.getElementById('deleteUserErrorMsg').textContent = `${usernameToDelete} 已被刪除！`;
        displayAllUserPoints(); // 更新用戶積分顯示
        displayUserSelect(); // 更新用戶選單
    } else {
        document.getElementById('deleteUserErrorMsg').textContent = "請選擇要刪除的用戶！";
    }
});

// 在管理員登入時顯示用戶選單
function onAdminLoggedIn() {
    displayUserSelect();
    displayAllUserPoints();
}

// 登入按鈕事件
document.getElementById('loginBtn').addEventListener('click', function() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (users[username] && users[username].password === password) {
        alert("登入成功！");
        currentUsername = username;
        currentRole = users[username].role;
        loginContainer.classList.add('hidden');
        checkInContainer.classList.remove('hidden');

        if (currentRole === 'admin') {
            adminContainer.classList.remove('hidden');
            onAdminLoggedIn(); // 顯示用戶選單
        }

        // 儲存用戶名到 localStorage
        localStorage.setItem('username', username);
    } else {
        errorMsg.textContent = "用戶名或密碼錯誤！";
    }
});

// 在管理員登入後顯示所有用戶的積分
function displayAllUserPoints() {
    userPointsContainer.innerHTML = ""; // 清空先前的內容
    for (const [username, user] of Object.entries(users)) {
        const userRow = document.createElement('div');
        userRow.classList.add('user-points-row');
        userRow.innerHTML = `
            <span>${username} - 積分: ${user.points}</span>
            <div class="modify-points">
                <input type="number" placeholder="變更積分" class="points-input" data-username="${username}">
                <button class="button modify-points-btn">變更</button>
            </div>
        `;
        userPointsContainer.appendChild(userRow);

        userRow.querySelector('.modify-points-btn').addEventListener('click', function() {
            const pointsInput = userRow.querySelector('.points-input');
            const changeValue = parseInt(pointsInput.value);
            if (!isNaN(changeValue)) {
                user.points += changeValue; // 更新積分
                updatePointsDisplay(); // 更新當前用戶的積分顯示
                displayAllUserPoints(); // 重新顯示所有用戶的積分
                alert(`成功變更 ${username} 的積分！`);
            } else {
                alert("請輸入有效的積分變更數值。");
            }
            pointsInput.value = '';
        });
    }
}

// 在管理員登入時顯示用戶選單
function onAdminLoggedIn() {
    displayUserSelect();
    displayAllUserPoints();
}


document.getElementById('checkInBtn').addEventListener('click', function() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeString = now.toLocaleString('zh-Hant', { timeZone: 'Asia/Taipei', hour12: false });

    let userCheckIn = JSON.parse(localStorage.getItem(`checkIn_${currentUsername}`)) || {};

    if (userCheckIn.date === today) {
        checkInStatus.textContent = "您今天已經打過卡！";
        return;
    }

    let status = '準時';
    let pointsChange = (hours > 12 || (hours === 12 && minutes > 30)) ? -5 : 10;
    if (pointsChange < 0) status = '遲到';

    users[currentUsername].points += pointsChange;
    updatePointsDisplay(); // 更新顯示

    userCheckIn = { date: today, status: status, time: timeString };
    localStorage.setItem(`checkIn_${currentUsername}`, JSON.stringify(userCheckIn));

    checkInStatus.textContent = `打卡成功！狀態: ${status} - 打卡時間: ${timeString}`;
    checkInErrorMsg.textContent = "";
});

// 兌換功能
document.querySelectorAll('.redeemBtn').forEach(button => {
    button.addEventListener('click', function() {
        const cost = parseInt(this.parentElement.getAttribute('data-cost'));
        const user = users[currentUsername];

        if (user.points >= cost) {
            user.points -= cost; // 減少用戶積分
            updatePointsDisplay(); // 更新顯示

            // 添加到已兌換的禮品列表
            const couponName = this.parentElement.firstChild.textContent.trim();
            user.usedCoupons.push(couponName);
            updateUsedCouponsDisplay();

            alert(`成功兌換 ${couponName}！`);
        } else {
            alert("積分不足，無法兌換！");
        }
    });
});

function updateUsedCouponsDisplay() {
    usedCouponsList.innerHTML = ""; // 清空列表
    const user = users[currentUsername];
    user.usedCoupons.forEach(coupon => {
        const listItem = document.createElement('li');
        listItem.textContent = coupon;
        usedCouponsList.appendChild(listItem);
    });
}

document.getElementById('clearLogsBtn').addEventListener('click', function() {
    if (confirm("您確定要清除所有打卡紀錄嗎？這將無法恢復。")) {
        localStorage.clear();
        alert("所有打卡紀錄已被清除。");
        userPointsContainer.innerHTML = "";
        usedCouponsList.innerHTML = ""; // 清空已兌換的禮品顯示
    }
});

document.getElementById('downloadCsvBtn').addEventListener('click', function() {
    let csvContent = "data:text/csv;charset=utf-8,日期,用戶名,狀態,打卡時間\n";
    for (const [username, user] of Object.entries(users)) {
        let userCheckIn = JSON.parse(localStorage.getItem(`checkIn_${username}`));
        if (userCheckIn) {
            csvContent += `${userCheckIn.date},${username},${userCheckIn.status},${userCheckIn.time}\n`;
        }
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "checkin_records.csv");
    document.body.appendChild(link);
    link.click();
});

document.getElementById('downloadUserPointsCsvBtn').addEventListener('click', function() {
    let csvContent = "data:text/csv;charset=utf-8,用戶名,積分\n";
    for (const [username, user] of Object.entries(users)) {
        csvContent += `${username},${user.points}\n`;
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "user_points.csv");
    document.body.appendChild(link);
    link.click();
});