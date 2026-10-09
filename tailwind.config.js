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
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 20px 60px rgba(0, 0, 0, 0.2)',
        soft: '0 10px 28px rgba(15, 23, 42, 0.12)',
        gold: '0 0 30px rgba(255, 215, 0, 0.35)',
        glow: '0 0 30px rgba(108, 92, 231, 0.35)',
      },
      backgroundImage: {
        'mesh-bg': 'radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 20%), radial-gradient(circle at bottom right, rgba(0,0,0,0.08), transparent 24%), linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gold-grad': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'red-grad': 'linear-gradient(135deg, #FF7675 0%, #d63031 100%)',
        'green-grad': 'linear-gradient(135deg, #00B894 0%, #009b6d 100%)',
        'blue-grad': 'linear-gradient(135deg, #0984E3 0%, #065fb4 100%)',
        'purple-grad': 'linear-gradient(135deg, #6C5CE7 0%, #5b45d5 100%)',
        'yellow-grad': 'linear-gradient(135deg, #FDCB6E 0%, #f39c12 100%)',
      },
    },
  },
  plugins: [],
};
