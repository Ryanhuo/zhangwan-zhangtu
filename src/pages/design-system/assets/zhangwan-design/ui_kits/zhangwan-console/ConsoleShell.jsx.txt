// App shell — recreated from compass/src/layout/index.vue + SelectRouter.vue + Sidebar/Menu.vue.
// Real 3-level nav: navbar module switcher -> sidebar menu groups -> leaf items.
// Fixed sidebar (190px / 56px collapsed) + 50px navbar.

function ConsoleShell({ moduleId, onModuleChange, activeItem, onSelectItem, collapsed, onToggleCollapse, onLogout, children }) {
  const { Select, UpdateTime, Breadcrumb } = CompassDesignSystem_6dfef5;
  const sidebarWidth = collapsed ? 56 : 190;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  const modules = window.ZHANGWAN_MENU;
  const current = modules.find((m) => m.id === moduleId) || modules[0];
  // Real sidebar is an el-menu with unique-opened: true (Sidebar/Menu.vue) —
  // opening one group accordions the previously-open one shut.
  const [openGroup, setOpenGroup] = React.useState(current.groups[0]?.title || null);
  React.useEffect(() => {
    setOpenGroup(current.groups[0]?.title || null);
  }, [moduleId]);

  React.useEffect(() => {
    function onDoc(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      {/* Sidebar */}
      <div
        style={{
          position: 'fixed', top: 0, bottom: 0, left: 0, width: sidebarWidth,
          background: '#fff', boxShadow: 'var(--shadow-sidebar)', zIndex: 1001,
          display: 'flex', flexDirection: 'column',
          transition: 'width var(--duration-fast) var(--ease-standard)',
        }}
      >
        {/* Logo */}
        <div style={{ height: 50, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? 0 : '0 14px', gap: 10, borderBottom: '1px solid var(--color-border-light)' }}>
          <img src="../../assets/logo.png" alt="罗盘" style={{ width: 32, height: 32, flexShrink: 0 }} />
          {!collapsed && <span style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: 16 }}>罗盘</span>}
        </div>

        {/* Menu tree */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {current.groups.map((group) => {
            const open = openGroup === group.title;
            return (
              <div key={group.title}>
                {!collapsed && (
                  <div
                    onClick={() => setOpenGroup((p) => (p === group.title ? null : group.title))}
                    style={{ height: 50, lineHeight: '50px', paddingLeft: 20, paddingRight: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 16, fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-hover-bg)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span>{group.title}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-placeholder)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
                  </div>
                )}
                {open && group.items.map((item) => {
                  const active = activeItem === item + '@' + group.title;
                  return (
                    <div
                      key={item}
                      onClick={() => onSelectItem(item, group.title)}
                      title={item}
                      style={{
                        height: 50, lineHeight: '50px',
                        paddingLeft: collapsed ? 0 : 60, textAlign: collapsed ? 'center' : 'left',
                        fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        color: active ? 'var(--brand-primary)' : 'var(--text-secondary)',
                        background: active ? 'var(--brand-active-bg)' : 'transparent',
                        borderRight: active ? '3px solid var(--brand-primary)' : '3px solid transparent',
                        cursor: 'pointer', boxSizing: 'border-box',
                      }}
                      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--brand-hover-bg)'; }}
                      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {collapsed ? item.slice(0, 1) : item}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Hamburger (collapse toggle) */}
        <div
          onClick={onToggleCollapse}
          style={{ flexShrink: 0, textAlign: 'center', cursor: 'pointer', padding: '10px 0', borderTop: '1px solid #e8e8e8', color: 'var(--text-body)', fontSize: 16 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.025)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          {collapsed ? '»' : '«'}
        </div>
      </div>

      {/* Main column */}
      <div style={{ marginLeft: sidebarWidth, transition: 'margin-left var(--duration-fast) var(--ease-standard)', minHeight: '100%', background: 'var(--surface-canvas)' }}>
        {/* Navbar */}
        <div style={{ height: 50, background: '#fff', boxShadow: 'var(--shadow-navbar)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 0 0', boxSizing: 'border-box', position: 'sticky', top: 0, zIndex: 9 }}>
          {/* Module switcher (SelectRouter) */}
          <div style={{ marginLeft: 20, minWidth: 140 }}>
            <Select
              options={modules.map((m) => ({ label: m.name, value: m.id }))}
              value={moduleId}
              onChange={onModuleChange}
            />
          </div>
          {/* User dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }} ref={menuRef}>
            <div onClick={() => setMenuOpen((o) => !o)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--surface-sunken)', border: '1px solid var(--color-border-light)' }} />
              <span style={{ fontSize: 14, color: 'var(--text-body)' }}>管理员</span>
              <span style={{ fontSize: 10, color: 'var(--text-faint)', transform: menuOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
            </div>
            {menuOpen && (
              <div style={{ position: 'absolute', top: '130%', right: 0, background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)', minWidth: 120, zIndex: 20, overflow: 'hidden' }}>
                <div
                  onClick={onLogout}
                  style={{ padding: '10px 16px', fontSize: 14, color: 'var(--text-body)', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  退出登录
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Breadcrumb strip — real InfoBar.vue: transparent, no card background,
            [group, item] levels (not [module, item]), sits inline with
            UpdateTime, hidden entirely on the dashboard (levelList is empty
            until a menu item is selected). */}
        {activeItem && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', boxSizing: 'border-box' }}>
            <Breadcrumb items={[{ label: activeItem.split('@')[1] }, { label: activeItem.split('@')[0] }]} />
            <UpdateTime time={new Date().toISOString().slice(0, 16).replace('T', ' ')} />
          </div>
        )}

        {/* Page content */}
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}

window.ConsoleShell = ConsoleShell;
