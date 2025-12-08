import Header from './components/Header';
import Footer from './components/Footer';
import ClampGenerator from './components/ClampGenerator';
import ErrorBoundary from './components/ErrorBoundary';
import './App.scss';

function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <Header />
        <main className="main">
          <ClampGenerator />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
