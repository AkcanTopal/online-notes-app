import React, { useState, useEffect, useCallback } from 'react';

const App = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [cells, setCells] = useState({});
  const [activeCell, setActiveCell] = useState(null);
  const [cellText, setCellText] = useState('');
  const [selectedColor, setSelectedColor] = useState('white');
  const [onlineUsers, setOnlineUsers] = useState(['Kullanıcı1', 'Kullanıcı2']);
  const [loginError, setLoginError] = useState('');

  // Initialize cells
  useEffect(() => {
    const initialCells = {};
    // First row: 1-11
    for (let i = 1; i <= 11; i++) {
      initialCells[i] = { text: '', color: 'white' };
    }
    // Second row: 22-12 (reverse order)
    for (let i = 22; i >= 12; i--) {
      initialCells[i] = { text: '', color: 'white' };
    }
    setCells(initialCells);
  }, []);

  // Load saved data from localStorage when component mounts
  useEffect(() => {
    const savedCells = localStorage.getItem('onlineNotesCells');
    if (savedCells) {
      setCells(JSON.parse(savedCells));
    }
    
    const savedUser = localStorage.getItem('onlineNotesUser');
    if (savedUser) {
      setUser(savedUser);
      // Simulate adding user to online users
      updateOnlineUsers(savedUser, 'join');
    }
  }, []);

  // Save cells to localStorage whenever cells change
  useEffect(() => {
    if (Object.keys(cells).length > 0) {
      localStorage.setItem('onlineNotesCells', JSON.stringify(cells));
    }
  }, [cells]);

  // Simulate online users management
  const updateOnlineUsers = (username, action) => {
    setOnlineUsers(prev => {
      if (action === 'join') {
        // Add user if not already in the list
        if (!prev.includes(username)) {
          return [...prev, username];
        }
        return prev;
      } else if (action === 'leave') {
        // Remove user from the list
        return prev.filter(user => user !== username);
      }
      return prev;
    });
  };

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setLoginError('Kullanıcı adı ve şifre gereklidir');
      return;
    }

    // Simple validation (in real app, this would be server-side)
    const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    
    if (savedUsers[username] && savedUsers[username] === password) {
      setUser(username);
      localStorage.setItem('onlineNotesUser', username);
      updateOnlineUsers(username, 'join');
      setLoginError('');
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Geçersiz kullanıcı adı veya şifre');
    }
  };

  const handleRegister = () => {
    if (!username.trim() || !password.trim()) {
      setLoginError('Kullanıcı adı ve şifre gereklidir');
      return;
    }

    if (username.length < 3) {
      setLoginError('Kullanıcı adı en az 3 karakter olmalıdır');
      return;
    }

    if (password.length < 4) {
      setLoginError('Şifre en az 4 karakter olmalıdır');
      return;
    }

    // Save user to localStorage (in real app, this would be server-side)
    const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    
    if (savedUsers[username]) {
      setLoginError('Bu kullanıcı adı zaten alınmış');
      return;
    }

    savedUsers[username] = password;
    localStorage.setItem('registeredUsers', JSON.stringify(savedUsers));
    
    setUser(username);
    localStorage.setItem('onlineNotesUser', username);
    updateOnlineUsers(username, 'join');
    setLoginError('');
    setUsername('');
    setPassword('');
  };

  const handleLogout = () => {
    if (user) {
      updateOnlineUsers(user, 'leave');
      localStorage.removeItem('onlineNotesUser');
    }
    setUser(null);
  };

  const handleCellClick = (cellId) => {
    setActiveCell(cellId);
    setCellText(cells[cellId]?.text || '');
    setSelectedColor(cells[cellId]?.color || 'white');
  };

  const saveCell = useCallback(() => {
    if (activeCell) {
      setCells(prev => ({
        ...prev,
        [activeCell]: {
          text: cellText,
          color: selectedColor
        }
      }));
      setActiveCell(null);
      setCellText('');
      setSelectedColor('white');
    }
  }, [activeCell, cellText, selectedColor]);

  const clearCell = useCallback(() => {
    if (activeCell) {
      setCells(prev => ({
        ...prev,
        [activeCell]: {
          text: '',
          color: 'white'
        }
      }));
      setActiveCell(null);
      setCellText('');
      setSelectedColor('white');
    }
  }, [activeCell]);

  const getColorClass = (color) => {
    switch (color) {
      case 'green': return 'bg-green-200 border-green-300';
      case 'orange': return 'bg-orange-200 border-orange-300';
      case 'red': return 'bg-red-200 border-red-300';
      case 'blue': return 'bg-blue-200 border-blue-300';
      case 'yellow': return 'bg-yellow-200 border-yellow-300';
      default: return 'bg-white border-gray-300';
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && activeCell) {
        setActiveCell(null);
        setCellText('');
      }
      if (e.key === 'Enter' && e.ctrlKey && activeCell) {
        saveCell();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeCell, cellText, selectedColor, saveCell]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 pb-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Online Notlar</h1>
            <p className="text-gray-600 mt-2">Arkadaşlarınızla not paylaşın</p>
          </div>

          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => {
                setIsLogin(true);
                setLoginError('');
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                isLogin 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setLoginError('');
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                !isLogin 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700 text-sm">{loginError}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Kullanıcı adı"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    isLogin ? handleLogin() : handleRegister();
                  }
                }}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    isLogin ? handleLogin() : handleRegister();
                  }
                }}
              />
            </div>
            <button
              onClick={isLogin ? handleLogin : handleRegister}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          </div>

          {isLogin && (
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Demo için herhangi bir kullanıcı adı ve şifre ile kayıt olabilirsiniz.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Online Notlar</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span className="text-sm text-gray-600">{onlineUsers.length} kişi online</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Merhaba, {user}</span>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Çıkış Yap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Not Tablosu</h2>
              <div className="text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">ESC: İptal</span>
                <span className="bg-gray-100 px-2 py-1 rounded ml-2">Ctrl+Enter: Kaydet</span>
              </div>
            </div>
            
            {/* Grid Container */}
            <div className="overflow-x-auto">
              <div className="grid grid-cols-11 gap-2 min-w-full">
                {/* First Row: 1-11 */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((cellId) => (
                  <div
                    key={cellId}
                    onClick={() => handleCellClick(cellId)}
                    className={`
                      aspect-square min-h-[80px] border-2 rounded-lg cursor-pointer
                      flex flex-col items-center justify-center p-2 hover:shadow-md transition-all
                      ${getColorClass(cells[cellId]?.color)}
                      ${activeCell === cellId ? 'ring-2 ring-indigo-500' : ''}
                    `}
                  >
                    <span className="text-xs font-medium text-gray-500 mb-1">{cellId}</span>
                    <div className="text-sm text-center text-gray-700 break-words overflow-hidden">
                      {cells[cellId]?.text || ''}
                    </div>
                  </div>
                ))}
                
                {/* Second Row: 22-12 (reverse order) */}
                {[22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12].map((cellId) => (
                  <div
                    key={cellId}
                    onClick={() => handleCellClick(cellId)}
                    className={`
                      aspect-square min-h-[80px] border-2 rounded-lg cursor-pointer
                      flex flex-col items-center justify-center p-2 hover:shadow-md transition-all
                      ${getColorClass(cells[cellId]?.color)}
                      ${activeCell === cellId ? 'ring-2 ring-indigo-500' : ''}
                    `}
                  >
                    <span className="text-xs font-medium text-gray-500 mb-1">{cellId}</span>
                    <div className="text-sm text-center text-gray-700 break-words overflow-hidden">
                      {cells[cellId]?.text || ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Online Users */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Online Kullanıcılar</h3>
          <div className="flex flex-wrap gap-2">
            {onlineUsers.map((userName, index) => (
              <div 
                key={index} 
                className={`px-3 py-1 rounded-full text-sm mb-2 ${
                  userName === user 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {userName} {userName === user && '(Sen)'}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cell Edit Modal */}
      {activeCell && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mb-20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Hücre {activeCell} Düzenle
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Not:
                </label>
                <textarea
                  value={cellText}
                  onChange={(e) => setCellText(e.target.value)}
                  placeholder="Notunuzu yazın..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows="4"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renk:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'white', label: 'Beyaz', class: 'bg-white border-gray-400' },
                    { value: 'green', label: 'Yeşil', class: 'bg-green-200 border-green-400' },
                    { value: 'orange', label: 'Turuncu', class: 'bg-orange-200 border-orange-400' },
                    { value: 'red', label: 'Kırmızı', class: 'bg-red-200 border-red-400' },
                    { value: 'blue', label: 'Mavi', class: 'bg-blue-200 border-blue-400' },
                    { value: 'yellow', label: 'Sarı', class: 'bg-yellow-200 border-yellow-400' },
                  ].map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`
                        w-10 h-10 border-2 rounded-lg transition-all
                        ${color.class}
                        ${selectedColor === color.value ? 'ring-2 ring-indigo-500 scale-110' : 'hover:scale-105'}
                      `}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={saveCell}
                className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Kaydet</span>
              </button>
              <button
                onClick={clearCell}
                className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Temizle
              </button>
              <button
                onClick={() => setActiveCell(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
