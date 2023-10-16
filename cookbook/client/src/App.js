import './App.css';

const logoPath = "./images/cover.jpg";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logoPath} className="App-logo" alt="logo" />
        <p>
          Prepare to be amazed be simple recipes
        </p>
        <p>
          Cooming soon™
        </p>
      </header>
    </div>
  );
}

export default App;
