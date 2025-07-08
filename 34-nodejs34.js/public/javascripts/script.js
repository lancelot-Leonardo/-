function showAlert(message, type = 'info', duration) {
    const activeElement = document.activeElement;
    const formEl = activeElement.closest('form');

    if (!formEl) {
        console.error('没找到所属 form 容器唷～');
        return;
    }

    const alertDiv = formEl.querySelector('.form-alert');

    if (!alertDiv) {
        console.error('没找到 .form-alert 容器唷～');
        return;
    }

    alertDiv.className = `form-alert alert alert-${type}`;
    alertDiv.textContent = message;

    // ✅ 如果写了 CSS display: none，要加下面这句
    alertDiv.style.display = 'block';

    if (duration) {
        setTimeout(() => {
            alertDiv.style.display = 'none';
            alertDiv.textContent = '';
        }, duration);
    }
}

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    token && (config.headers.Authorization = `Bearer ${token}`);
    return config;
});

// 添加和管理账单页面脚本
$('body.list,body.add').on('click', 'button.delete', function (e) {
    if ($(this).text() === '添加') {
        const form = document.querySelector('body.add>form');
        const formData = serialize(form, { hash: true, empty: true });
        console.log(formData);
        axios({
            method: 'post',
            url: '/api',
            data: formData,
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    } else {
        let id = $(this).data('id');
        axios({
            method: 'delete',
            url: `http://127.0.0.1:8888/api/delete/${id}`,
        }).then(res => {
            $(this).parent().parent().remove();
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    };
});
const usernameReg = /^[a-zA-Z_][a-zA-Z0-9_]{2,15}$/;
const passwordReg = /^[a-zA-Z0-9]{6,16}$/;

// 注册和登录页面脚本
$('body.register,body.login').on('click', 'button', function (e) {
    e.preventDefault();
    const form = $(this).parent()[0];
    const formData = serialize(form, { hash: true, empty: true });
    for (let key in formData) {
        formData[key] = formData[key].trim();
        if (formData[key] === '') {
            return showAlert('不许有留白', 'danger', 3000);
        };
    };
    if (!usernameReg.test(formData.username)) {
        return showAlert('用户名格式不正确!', 'danger', 3000);
    };
    if (!passwordReg.test(formData.password)) {
        return showAlert('密码格式不正确！', 'danger', 3000);
    };
    console.log(formData);
    const { password, confirm } = formData;

    let realThis = $(this).closest('body');
    let url
    if (realThis.hasClass('register')) {
        if (password !== confirm) {
            showAlert('两次密码不一致！', 'danger', 3000);
            return;
        };
        axios({
            method: 'post',
            url: '/api/reg',
            data: formData
        }).then((res) => {
            console.log(res);
            const { code, message } = res.data;
            if (code == 409) {
                showAlert(message, 'danger', 3000);
                return;
            } else {
                showAlert(message, 'success');
                setTimeout(() => {
                    window.location.href = '/log';
                }, 1500);
            };
        }).catch((err) => {
            console.log(err);
            showAlert('服务器繁忙，请稍后重试', 'danger', 3000);
        });
    } else {
        axios({
            method: 'post',
            url: '/api/log',
            data: formData
        }).then((res) => {
            const { code, message } = res.data;
            if (res.data.code == 401) {
                showAlert(message, 'danger', 3000);
                return;
            } else {
                showAlert(message, 'success');
                localStorage.setItem('token', res.data.token);
                console.log(res.data.token);
                setTimeout(() => {
                    window.location.href = '/add';
                }, 1500);
            };
        }).catch((err) => {
            console.log(err);
            showAlert('服务器繁忙，请稍后重试', 'danger', 3000);
        });
    };
});

$("#confirm-logout").on("click", function () {
    // 这里写你实际的登出逻辑，比如跳转到登出接口
    axios({
        method: 'post',
        url: '/api/logout'
    }).then(res => {
        window.location.href = '/log'
    }).catch(err => {
        console.log(err);
    });
});