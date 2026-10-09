export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ludoRed: '#FF7675',
        ludoGreen: '#00B894',
        ludoYellow: '#FDCB6E',
        ludoBlue: '#0984E3',
        ludoPurple: '#6C5CE7',
        ludoGold: '#FFD700',
        ludoOrange: '#FF9800',
      },
      backgroundImage: {
        'gradient-mesh': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-mesh-alt': 'radial-gradient(circle at 20% 50%, rgba(108,92,231,0.8) 0%, transparent 30%), radial-gradient(circle at 80% 75%, rgba(255,118,117,0.5) 0%, transparent 30%), linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-premium-gold': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'gradient-premium-purple': 'linear-gradient(135deg, #6C5CE7 0%, #5f3dc4 100%)',
        'gradient-premium-red': 'linear-gradient(135deg, #FF7675 0%, #d63031 100%)',
        'gradient-premium-green': 'linear-gradient(135deg, #00B894 0%, #009d7f 100%)',
        'gradient-premium-blue': 'linear-gradient(135deg, #0984E3 0%, #065fb3 100%)',
        'gradient-premium-yellow': 'linear-gradient(135deg, #FDCB6E 0%, #f39c12 100%)',
      },
      boxShadow: {
        'premium-soft': '0 20px 60px rgba(0, 0, 0, 0.18), 0 8px 24px rgba(0,0,0,0.12)',
        'premium-lg': '0 30px 90px rgba(0, 0, 0, 0.2)',
        'glow-gold': '0 0 30px rgba(255, 215, 0, 0.35), 0 12px 36px rgba(255, 170, 0, 0.18)',
        'glow-purple': '0 0 30px rgba(108, 92, 231, 0.35), 0 12px 36px rgba(108, 92, 231, 0.18)',
        'glow-red': '0 0 30px rgba(255, 118, 117, 0.3), 0 12px 36px rgba(255, 118, 117, 0.18)',
        'glass-card': '0 8px 32px rgba(31, 41, 55, 0.18)',
      },
      borderRadius: {
        '2xl-premium': '24px',
        '3xl-premium': '32px',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        coin: {
          '0%, 100%': { transform: 'translateY(0) rotateY(0deg)' },
          '50%': { transform: 'translateY(-10px) rotateY(90deg)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s infinite linear',
        coin: 'coin 0.8s ease-in-out',
      },
    },
  },
  plugins: [],
};
