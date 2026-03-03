import { Search, Heart, ShoppingCart, LogIn, LogOut, UserPlus, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import path from '../utils/path';

const Header = () => {
    const navigate = useNavigate();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const menuItems = [
        { name: 'Giới thiệu', path: path.HOME },
        { name: 'Mặt hàng hôm nay', path: path.PRODUCTS}
    ];

    return (
        <header className="w-full bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-green-100"
            style={{ fontFamily: 'montserrat-normal' }}
        >
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Logo - Luôn hiển thị rõ ràng */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 
                rounded-full overflow-hidden bg-green-50 
                flex items-center justify-center flex-shrink-0">
                            <img className="w-full h-full object-cover" src="/logo.png" alt="Logo" onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<span class="text-green-600 font-bold text-xl">P</span>';
                            }} />
                        </div>
                        <span className="text-indigo-800 font-bold md:text-xl">Hải Sản Minh Hoàng Cà Mau</span>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-8">
                        {menuItems.map((item) => (
                            <p
                                key={item.name}
                                onClick={() => navigate(item.path)}
                                className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 relative group"
                            >
                                {item.name}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-200"></span>
                            </p>
                        ))}
                        <div className='relative flex items-center'>
                            <Search className="absolute w-5 h-5 text-gray-400 left-3 pointer-events-none" />
                            <input type='search'
                                placeholder='Tìm tên mặt hàng...'
                                className='w-80 h-10 rounded-3xl bg-gray-50 pl-8'
                                onFocus={(e) => e.target.classList.add('ring-2', 'ring-green-300', 'outline-none')}
                                onBlur={(e) => e.target.classList.remove('ring-2', 'ring-green-300', 'outline-none')}
                                onMouseEnter={(e) => e.target.classList.add('ring-2', 'ring-blue-400')}
                                onMouseLeave={(e) => e.target.classList.remove('ring-2', 'ring-blue-200')}
                            />
                        </div>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button className="p-2 hover:bg-green-50 rounded-full transition-colors relative">
                            <Heart className="w-5 h-5 text-gray-600" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
                        </button>
                        <button className="p-2 hover:bg-green-50 rounded-full transition-colors relative">
                            <ShoppingCart className="w-5 h-5 text-gray-600" />
                            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">5</span>
                        </button>
                        <button className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                            <LogIn className="w-4 h-4" />
                            <span>Đăng nhập</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 hover:bg-green-50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6 text-gray-700" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-700" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-green-100 py-4 animate-in slide-in-from-top">
                        <nav className="flex flex-col gap-1">
                            {menuItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.path}
                                    className="px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 font-medium rounded-lg transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </nav>

                        {/* Mobile Actions */}
                        <div className="mt-4 pt-4 border-t border-green-100 px-4 space-y-3">
                            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-green-50 rounded-lg transition-colors">
                                <span className="text-gray-700 font-medium">Yêu thích</span>
                                <div className="relative">
                                    <Heart className="w-5 h-5 text-gray-600" />
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
                                </div>
                            </button>
                            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-green-50 rounded-lg transition-colors">
                                <span className="text-gray-700 font-medium">Giỏ hàng</span>
                                <div className="relative">
                                    <ShoppingCart className="w-5 h-5 text-gray-600" />
                                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">5</span>
                                </div>
                            </button>
                            <button className="w-full mt-3 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium">
                                <LogIn className="w-5 h-5" />
                                <span>Đăng nhập</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;