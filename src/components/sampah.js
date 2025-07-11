{navItems.map(item => {
    const isActive = currentPage === item.id;
    let listNav;
    if(isLoggedIn==false){
        listNav = ['logout'];
    }else{
        listNav = ['publications', 'add', 'logout'];
    }
    const isImplemented = listNav.includes(item.id);
    return (
        <button
            key={item.id}
            onClick={() => isImplemented && setCurrentPage(item.id) }
            disabled={!isImplemented}
            className={
                `px-3 py-2 rounded-md text-sm font-semibold transition-all duration-300  border border-transparent ` +
                `${isImplemented ? 'cursor-pointer' : 'opacity-60'} ` + `${isActive && isImplemented ? 'bg-slate-200 text-sky-900 shadow-inner' : 'text-sky-100 hover:text-white'}`
            }
        >
            {item.label}
        </button>
    );
})}