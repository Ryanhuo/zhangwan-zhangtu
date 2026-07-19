// Root app — wires shell -> screen. Click-through only, no real backend.
function App() {
  const [moduleId, setModuleId] = React.useState('game');
  const [activeItem, setActiveItem] = React.useState(null); // "item@group" or null (dashboard)
  const [collapsed, setCollapsed] = React.useState(false);

  const itemName = activeItem ? activeItem.split('@')[0] : null;

  return (
    <ConsoleShell
      moduleId={moduleId}
      onModuleChange={(id) => { setModuleId(id); setActiveItem(null); }}
      activeItem={activeItem}
      onSelectItem={(item, group) => setActiveItem(item + '@' + group)}
      collapsed={collapsed}
      onToggleCollapse={() => setCollapsed((c) => !c)}
    >
      {itemName
        ? <AnalysisScreen key={moduleId + activeItem} moduleId={moduleId} itemName={itemName} />
        : <DashboardScreen moduleId={moduleId} />}
    </ConsoleShell>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
