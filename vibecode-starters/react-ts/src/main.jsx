import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
    return (
        <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '50px' }}>
            <h1>🚀 Hello from VibeCode!</h1>
            <p>Your React app is running successfully.</p>
            <p>Edit <code>src/main.jsx</code> to get started.</p>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
