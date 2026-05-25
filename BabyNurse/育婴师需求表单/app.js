// 全局状态
let isExtraOpen = false;

// DOM 元素
const form = document.getElementById('demandForm');
const submitBtn = document.getElementById('submitBtn');
const successModal = document.getElementById('successModal');
const modalConfirm = document.getElementById('modalConfirm');
const extraToggle = document.getElementById('extraToggle');
const extraContent = document.getElementById('extraContent');
const collapsibleArrow = extraToggle.querySelector('.collapsible-arrow');

// 初始化
function init() {
    initEventListeners();
    initStepper();
    setDefaultDate();
}

// 设置默认日期为今天
function setDefaultDate() {
    const dateInput = document.querySelector('input[name="startDate"]');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
}

// 初始化数字步进器
function initStepper() {
    document.querySelectorAll('.number-stepper').forEach(stepper => {
        const minusBtn = stepper.querySelector('.minus');
        const plusBtn = stepper.querySelector('.plus');
        const input = stepper.querySelector('input');

        minusBtn.addEventListener('click', function() {
            let value = parseInt(input.value) || 0;
            const min = parseInt(input.min) || 1;
            if (value > min) {
                input.value = value - 1;
            }
        });

        plusBtn.addEventListener('click', function() {
            let value = parseInt(input.value) || 0;
            const max = parseInt(input.max) || 10;
            if (value < max) {
                input.value = value + 1;
            }
        });
    });
}

// 初始化事件监听
function initEventListeners() {
    // 提交按钮
    submitBtn.addEventListener('click', function() {
        if (validateForm()) {
            submitForm();
        }
    });

    // 弹窗确认按钮
    modalConfirm.addEventListener('click', function() {
        successModal.classList.add('hidden');
        resetForm();
    });

    // 折叠/展开补充信息
    extraToggle.addEventListener('click', function() {
        isExtraOpen = !isExtraOpen;
        if (isExtraOpen) {
            extraContent.classList.remove('hidden');
            collapsibleArrow.classList.add('open');
        } else {
            extraContent.classList.add('hidden');
            collapsibleArrow.classList.remove('open');
        }
    });

    // 宠物选择联动
    document.querySelectorAll('input[name="hasPet"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const petTypeInput = document.querySelector('input[name="petType"]');
            if (this.value === '有') {
                petTypeInput.classList.remove('hidden');
            } else {
                petTypeInput.classList.add('hidden');
                petTypeInput.value = '';
            }
        });
    });



    // 输入框焦点移除时清除错误状态
    document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
        input.addEventListener('focus', function() {
            this.classList.remove('error');
            const formGroup = this.closest('.form-group');
            if (formGroup) {
                const errorMsg = formGroup.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
    });
}

// 验证表单
function validateForm() {
    let isValid = true;

    // 清除之前的错误状态
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    // 验证姓名
    const nameInput = document.querySelector('input[name="customerName"]');
    if (!nameInput.value.trim()) {
        isValid = false;
        nameInput.classList.add('error');
        showError(nameInput, '请输入姓名');
    }

    // 验证手机号
    const phoneInput = document.querySelector('input[name="phone"]');
    if (!phoneInput.value.trim()) {
        isValid = false;
        phoneInput.classList.add('error');
        showError(phoneInput, '请输入手机号码');
    } else if (!/^1[3-9]\d{9}$/.test(phoneInput.value)) {
        isValid = false;
        phoneInput.classList.add('error');
        showError(phoneInput, '请输入正确的手机号码');
    }

    // 薪资区间逻辑校验（如果填写了的话）
    const salaryMin = document.querySelector('input[name="salaryMin"]');
    const salaryMax = document.querySelector('input[name="salaryMax"]');
    if (salaryMin.value && salaryMax.value) {
        const min = parseInt(salaryMin.value);
        const max = parseInt(salaryMax.value);
        if (min > max) {
            isValid = false;
            salaryMin.classList.add('error');
            salaryMax.classList.add('error');
            showError(salaryMin, '最低薪资不能高于最高薪资');
        }
    }

    return isValid;
}

// 显示错误提示
function showError(inputElement, message) {
    const formGroup = inputElement.closest('.form-group');
    if (formGroup && !formGroup.querySelector('.error-message')) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = message;
        formGroup.appendChild(errorMsg);
    }
}

// 提交表单
function submitForm() {
    const formData = new FormData(form);
    const data = {};
    
    // 收集所有表单数据
    formData.forEach((value, key) => {
        if (data[key]) {
            if (!Array.isArray(data[key])) {
                data[key] = [data[key]];
            }
            data[key].push(value);
        } else {
            data[key] = value;
        }
    });

    // 处理单选按钮
    const radioNames = ['serviceType', 'duration', 'hasPet', 'ageRequirement', 'regionRequirement'];
    radioNames.forEach(name => {
        const checked = form.querySelector(`input[name="${name}"]:checked`);
        data[name] = checked ? checked.value : '';
    });

    // 处理复选框
    const checkboxNames = ['needSleep', 'needHousework', 'needCook', 'exclusiveCare'];
    checkboxNames.forEach(name => {
        const checked = form.querySelector(`input[name="${name}"]:checked`);
        data[name] = checked ? checked.value : '';
    });

    console.log('表单数据：', data);

    // 模拟提交
    // fetch('/api/submit-demand', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    // })
    // .then(response => response.json())
    // .then(result => {
    //     if (result.success) {
    //         showSuccessModal();
    //     }
    // });

    showSuccessModal();
}

// 显示成功弹窗
function showSuccessModal() {
    successModal.classList.remove('hidden');
}

// 重置表单
function resetForm() {
    form.reset();
    
    // 重置联动字段
    document.querySelector('input[name="petType"]').classList.add('hidden');
    
    // 清除错误状态
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    // 折叠补充信息
    isExtraOpen = false;
    extraContent.classList.add('hidden');
    collapsibleArrow.classList.remove('open');
    
    setDefaultDate();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
