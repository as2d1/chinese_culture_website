// 侧边栏切换函数
function toggleSidebar() {
    const sidebar = $('#sidebar');
    const mainContent = $('#main-content');
    const toggleBtn = $('#sidebar-toggle');
    
    // 确保切换按钮始终可见
    toggleBtn.css({
        'visibility': 'visible',
        'opacity': '1',
        'display': 'flex',
        'z-index': '9999'
    });
    
    // 如果侧边栏已收起，先添加过渡类
    if (sidebar.hasClass('collapsed')) {
        sidebar.addClass('transitioning');
        
        // 设置延迟以允许CSS过渡效果生效
        setTimeout(() => {
            sidebar.removeClass('collapsed');
            mainContent.removeClass('expanded');
            
            // 延迟后移除过渡类
            setTimeout(() => {
                sidebar.removeClass('transitioning');
            }, 300);
        }, 10);
    } else {
        // 添加过渡类
        sidebar.addClass('transitioning');
        
        // 收起侧边栏
        sidebar.addClass('collapsed');
        mainContent.addClass('expanded');
        
        // 延迟后移除过渡类
        setTimeout(() => {
            sidebar.removeClass('transitioning');
        }, 300);
    }
    
    // 切换图标并添加动画
    const icon = $('#sidebar-toggle i');
    if (sidebar.hasClass('collapsed')) {
        icon.removeClass('fa-chevron-left').addClass('fa-chevron-right');
        icon.addClass('icon-animated');
        
        // 确保图标在收缩状态下可见
        setTimeout(() => {
            $('#sidebar-toggle').css({
                'visibility': 'visible',
                'opacity': '1',
                'display': 'flex'
            });
        }, 100);
    } else {
        icon.removeClass('fa-chevron-right').addClass('fa-chevron-left');
        icon.addClass('icon-animated');
    }
    
    // 移除图标动画类
    setTimeout(() => {
        icon.removeClass('icon-animated');
    }, 500);
    
    // 保存状态到本地存储
    localStorage.setItem('sidebarCollapsed', sidebar.hasClass('collapsed'));
}

// 检查侧边栏状态
function checkSidebarState() {
    // 默认侧边栏展开 - 强制设置为false
    localStorage.setItem('sidebarCollapsed', 'false');
    
    // 确保侧边栏处于展开状态
    $('#sidebar').removeClass('collapsed');
    $('#main-content').removeClass('expanded');
    $('#sidebar-toggle i').removeClass('fa-chevron-right').addClass('fa-chevron-left');
    
    // 确保切换按钮可见
    $('#sidebar-toggle').css({
        'visibility': 'visible',
        'opacity': '1',
        'display': 'flex',
        'z-index': '9999'
    });
    
    // 确保浮动按钮也可见
    $('#sidebar-float-toggle').css({
        'display': 'flex'
    });
}

// 显示提示信息
function showToast(message, type = 'success') {
    // 如果页面中不存在toast容器，则创建一个
    if ($('#toast-container').length === 0) {
        $('body').append('<div id="toast-container"></div>');
    }
    
    // 生成一个唯一ID
    const id = 'toast-' + Date.now();
    
    // 创建toast元素
    const toast = `
        <div id="${id}" class="custom-toast ${type}">
            <div class="toast-icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            </div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    // 添加到容器
    $('#toast-container').append(toast);
    
    // 显示
    setTimeout(() => {
        $(`#${id}`).addClass('show');
    }, 100);
    
    // 3秒后消失
    setTimeout(() => {
        $(`#${id}`).removeClass('show');
        setTimeout(() => {
            $(`#${id}`).remove();
        }, 500);
    }, 3000);
}

// 页面加载后执行
$(document).ready(function() {
    // 检查侧边栏状态
    checkSidebarState();
    
    // 响应式处理
    $(window).resize(function() {
        handleResponsive();
    });
    
    // 初始响应式检查
    handleResponsive();
});

// 响应式处理
function handleResponsive() {
    if ($(window).width() < 992) {
        $('#sidebar').removeClass('collapsed');
        $('#main-content').removeClass('expanded');
        
        if (!$('#sidebar').hasClass('show')) {
            $('#main-content').css('margin-left', '0');
        }
    } else {
        // 恢复保存的状态
        const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (sidebarCollapsed) {
            $('#sidebar').addClass('collapsed');
            $('#main-content').addClass('expanded');
        } else {
            $('#sidebar').removeClass('collapsed');
            $('#main-content').removeClass('expanded');
        }
    }
}

// CSS样式
const toastStyles = `
#toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
}

.custom-toast {
    display: flex;
    align-items: center;
    background: white;
    padding: 12px 20px;
    border-radius: 8px;
    margin-bottom: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s ease;
    min-width: 280px;
}

.dark-theme .custom-toast {
    background: #333;
    color: #fff;
}

.custom-toast.show {
    transform: translateX(0);
    opacity: 1;
}

.custom-toast .toast-icon {
    margin-right: 12px;
    font-size: 1.2rem;
}

.custom-toast.success .toast-icon {
    color: #4CAF50;
}

.custom-toast.error .toast-icon {
    color: #F44336;
}

.custom-toast .toast-message {
    flex: 1;
}
`;

// 添加样式到页面
$('<style>').text(toastStyles).appendTo('head');
