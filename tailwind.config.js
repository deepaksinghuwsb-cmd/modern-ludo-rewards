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
        premiumPurple: '#7c3aed',
        darkPurple: '#4c1d95',
        glassWhite: '#f8fafc',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 20px 60px rgba(0, 0, 0, 0.25)',
        soft: '0 8px 24px rgba(0, 0, 0, 0.15)',
        gold: '0 0 30px rgba(251, 191, 36, 0.4)',
        glow: '0 0 30px rgba(124, 58, 237, 0.4)',
        'inner-glow': 'inset 0 2px 4px rgba(255, 255, 255, 0.5)',
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(circle at 12% 18%, rgba(168, 85, 247, 0.18), transparent 28%), radial-gradient(circle at 88% 92%, rgba(236, 72, 153, 0.12), transparent 32%), linear-gradient(135deg, #7c3aed 0%, #4c1d95 50%, #1e1b4b 100%)',
        'gold-gradient': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        'red-gradient': 'linear-gradient(135deg, #FF7675 0%, #d63031 100%)',
        'green-gradient': 'linear-gradient(135deg, #00B894 0%, #009b6d 100%)',
        'blue-gradient': 'linear-gradient(135deg, #0984E3 0%, #065fb4 100%)',
        'purple-gradient': 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
        'yellow-gradient': 'linear-gradient(135deg, #FDCB6E 0%, #f59e0b 100%)',
      },
      borderRadius: {
        'premium': '24px',
        '3xl-premium': '32px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        bounce3d: {
          '0%, 100%': { transform: 'translateY(0) scaleY(1)' },
          '50%': { transform: 'translateY(-12px) scaleY(1.05)' },
        },
        coinFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s infinite linear',
        bounce3d: 'bounce3d 1.2s ease-in-out',
        coinFlip: 'coinFlip 0.6s ease-in-out',
      },
    },
  },
  plugins: [],
};
