// 确保侧边栏切换按钮在DOM加载完成后可见
$(document).ready(function() {
    // 强制展开侧边栏 - 覆盖本地存储设置
    localStorage.setItem('sidebarCollapsed', 'false');
    
    // 确保侧边栏处于展开状态
    $('#sidebar').removeClass('collapsed');
    $('#main-content').removeClass('expanded');
    $('#sidebar-toggle i').removeClass('fa-chevron-right').addClass('fa-chevron-left');
    
    // 始终确保按钮可见，无论侧边栏状态如何
    setTimeout(() => {
        $('#sidebar-toggle').css({
            'visibility': 'visible',
            'opacity': '1',
            'display': 'flex',
            'z-index': '9999'
        });
    }, 100);
    
    // 监听窗口大小变化
    $(window).resize(function() {
        // 确保在不同屏幕大小下侧边栏切换按钮依然可见
        if ($('#sidebar').hasClass('collapsed')) {
            $('#sidebar-toggle').css({
                'visibility': 'visible',
                'opacity': '1',
                'display': 'flex',
                'z-index': '1050'
            });
        }
    });
});

// 添加双击主内容区域展开侧边栏功能
$(document).ready(function() {
    // 在主内容区域添加双击事件，在侧边栏收起时可以通过双击展开
    $('#main-content').dblclick(function(e) {
        // 只在侧边栏处于收起状态时生效
        if ($('#sidebar').hasClass('collapsed')) {
            toggleSidebar();
        }
    });
    
    // 添加浮动侧边栏按钮点击事件
    $('#sidebar-float-toggle').click(function() {
        toggleSidebar();
    });
});
