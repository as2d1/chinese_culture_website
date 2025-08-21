document.addEventListener('DOMContentLoaded', function() {
    // 强制侧边栏展开状态，忽略本地存储设置
    resetSidebarState();
    
    // 确保切换按钮可见
    ensureSidebarButtonsVisible();
});

/**
 * 重置侧边栏状态为展开
 */
function resetSidebarState() {
    // 清除localStorage中的状态
    localStorage.removeItem('sidebarCollapsed');
    
    // 强制设置为展开状态
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    
    if (sidebar) {
        sidebar.classList.remove('collapsed');
        sidebar.classList.remove('transitioning');
    }
    
    if (mainContent) {
        mainContent.classList.remove('expanded');
    }
    
    // 设置图标为正确状态
    const toggleIcon = document.querySelector('#sidebar-toggle i');
    if (toggleIcon) {
        toggleIcon.classList.remove('fa-chevron-right');
        toggleIcon.classList.add('fa-chevron-left');
    }
}

/**
 * 确保所有侧边栏按钮可见
 */
function ensureSidebarButtonsVisible() {
    // 设置常规侧边栏切换按钮可见
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) {
        toggleBtn.style.visibility = 'visible';
        toggleBtn.style.opacity = '1';
        toggleBtn.style.display = 'flex';
        toggleBtn.style.zIndex = '9999';
    }
    
    // 确保浮动按钮可见
    const floatBtn = document.getElementById('sidebar-float-toggle');
    if (floatBtn) {
        floatBtn.style.display = 'flex';
        floatBtn.style.zIndex = '9999';
    }
}
