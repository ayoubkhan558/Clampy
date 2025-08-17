import Header from './components/Header';
import Footer from './components/Footer';
import ClampGenerator from './components/ClampGenerator';
import './App.scss';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <ClampGenerator />
      </main>
      <Footer />
    </div>
  );
}

export default App;
