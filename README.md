# Clampy 🔧

A modern, interactive CSS `clamp()` generator that helps you create fluid, responsive typography and spacing values with ease.

![Clampy Screenshot](https://via.placeholder.com/800x400/6366f1/ffffff?text=Clampy+CSS+Clamp+Generator)

## ✨ Features

### 🎯 **Core Functionality**
- **Interactive CSS Clamp Generator** - Generate `clamp()` values with real-time preview
- **Multiple Output Formats** - CSS clamp, media query fallbacks, and custom properties
- **Unit Support** - Work with both `px` and `rem` units
- **Container Query Support** - Generate clamp values using container inline size (`cqi`)

### 📊 **Visualization & Analysis**
- **Interactive Chart** - Visualize how your clamp values change across screen sizes
- **Hover Tooltips** - See exact values at any screen width
- **Breakpoint Table** - View computed values for common device breakpoints
- **Live Preview** - Test your clamp values with customizable preview text

### 🔧 **Advanced Features**
- **Custom Breakpoints** - Add and manage your own device breakpoints
- **Editable Defaults** - Modify built-in breakpoints to match your needs
- **CSS Fallback Generation** - Automatic media query fallbacks for older browsers
- **URL Sharing** - Share configurations via URL parameters
- **One-Click Copy** - Copy generated CSS with a single click

### 🎨 **User Experience**
- **Responsive Design** - Works perfectly on all device sizes
- **Dark/Light Mode Support** - Adapts to your system preferences
- **Modern UI** - Clean, intuitive interface with smooth animations
- **Accessibility** - Built with accessibility best practices

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayoubkhan558/Clampy.git
   cd Clampy
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
# or
yarn build
```

## 🎯 How to Use

### Basic Usage

1. **Set your target values**
   - Minimum size (at smallest screen)
   - Maximum size (at largest screen)
   - Screen width range

2. **Choose output unit**
   - `px` for pixel-based values
   - `rem` for relative units

3. **Configure options**
   - Enable CSS fallbacks for older browsers
   - Use container queries instead of viewport units
   - Generate CSS custom properties

4. **Copy your code**
   - View generated CSS in the Code tab
   - Copy with one click
   - Share via URL

### Advanced Features

#### Custom Breakpoints
- Add your own device breakpoints
- Edit existing breakpoints
- View computed values for each breakpoint

#### CSS Fallbacks
Enable fallback support for browsers that don't support `clamp()`:
```css
@supports not (font-size: clamp(1rem, 4vw, 2rem)) {
  .element { font-size: 1rem; }
  @media (min-width: 768px) { .element { font-size: 1.5rem; } }
  @media (min-width: 1200px) { .element { font-size: 2rem; } }
}
```

#### Container Queries
Generate clamp values using container inline size:
```css
/* Regular viewport units */
font-size: clamp(1rem, 4vw + 0.5rem, 2rem);

/* Container query units */
font-size: clamp(1rem, 4cqi + 0.5rem, 2rem);
```

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: SCSS, CSS Custom Properties
- **Forms**: React Hook Form, Yup validation
- **Icons**: React Icons (Heroicons, FontAwesome)
- **Charts**: Custom SVG implementation
- **Build**: Vite with React plugin

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ClampGenerator.jsx    # Main generator component
│   ├── ClampChart.jsx        # Interactive visualization
│   ├── ClampPreview.jsx      # Live preview component
│   └── BreakpointTable.jsx   # Breakpoint management
├── hooks/              # Custom React hooks
│   ├── useClampForm.js       # Form state management
│   ├── useBreakpoints.js     # Breakpoint operations
│   └── useClampCalculations.js # Clamp calculations
├── utils/              # Utility functions
│   ├── clampUtils.js         # Clamp calculation logic
│   ├── constants.js          # App constants
│   └── validationSchemas.js  # Form validation
└── styles/             # SCSS stylesheets
    ├── _variables.scss       # CSS custom properties
    └── _clamp.scss          # Fluid typography mixins
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. **Code Style**
   - Use ESLint configuration
   - Follow React best practices
   - Write semantic HTML

2. **Component Structure**
   - Use functional components with hooks
   - Implement proper prop validation
   - Keep components focused and reusable

3. **Styling**
   - Use SCSS modules
   - Follow BEM naming convention
   - Ensure responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

**Developed by [Ayoub Khan](https://mayoub.dev)**
- 🌐 Website: [mayoub.dev](https://mayoub.dev)
- 💼 LinkedIn: [linkedin.com/in/ayoubkhan558](https://linkedin.com/in/ayoubkhan558)
- 📧 Email: contact@mayoub.dev

### Acknowledgments

- Inspired by modern CSS clamp() best practices
- Built with love for the web development community
- Special thanks to all contributors and users

## 🔗 Links

- **Live Demo**: [clampy.netlify.app](https://clampy.netlify.app)
- **GitHub**: [github.com/ayoubkhan558/Clampy](https://github.com/ayoubkhan558/Clampy)
- **Issues**: [Report bugs or request features](https://github.com/ayoubkhan558/Clampy/issues)

---

**Made with ❤️ by [Ayoub Khan](https://mayoub.dev)**
