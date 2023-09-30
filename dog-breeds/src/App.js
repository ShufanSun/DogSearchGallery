import './App.css';
import React, { Component } from 'react';
import Select from 'react-select';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dogs: [],
      selectedBreeds: [], // Store selected breed options
      breedImages: {}, // Store images for selected breeds
    };
  }

  componentDidMount() {
    this.fetchDogBreeds();
  }

  fetchDogBreeds() {
    fetch('https://dog.ceo/api/breeds/list/all')
      .then((res) => res.json())
      .then((data) => {
        this.setState({ dogs: Object.keys(data.message) });
      })
      .catch((error) => {
        console.error('Error fetching dog breeds:', error);
      });
  }

  findByBreed() {
    const { selectedBreeds } = this.state;

    if (selectedBreeds.length === 0) {
      console.error('No breeds selected.');
      return;
    }

    const fetchPromises = selectedBreeds.map((selectedBreed) => {
      const url = `https://dog.ceo/api/breed/${selectedBreed.value}/images`;
      return fetch(url)
        .then((response) => response.json());
    });

    Promise.all(fetchPromises)
      .then((results) => {
        const breedImages = {};

        results.forEach((result, index) => {
          const breedName = selectedBreeds[index].value;
          breedImages[breedName] = result.message;
        });

        this.setState({ breedImages });
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  }

  handleBreedChange = (selectedOptions) => {
    this.setState({ selectedBreeds: selectedOptions });
  };

  render() {
    const { dogs, breedImages, selectedBreeds } = this.state;

    const breedOptions = dogs.map((dogBreed) => ({
      value: dogBreed,
      label: dogBreed,
    }));

    return (
      <div className="App">
        <header className="App-header">
          <h1>
            <em>Welcome to My Dog Search App</em>
          </h1>
        </header>
        <Select
          options={breedOptions}
          isMulti
          value={selectedBreeds}
          onChange={this.handleBreedChange}
        />
        <button onClick={() => this.findByBreed()}>Find By Breed</button>

        <div id="listImageContainer">
          {selectedBreeds.map((selectedBreed, index) => (
            <div key={index}>
              <h2>{selectedBreed.value}</h2>
              {breedImages[selectedBreed.value] && breedImages[selectedBreed.value].length > 0 ? (
                breedImages[selectedBreed.value].map((imageURL, imageIndex) => (
                  <img key={imageIndex} src={imageURL} alt={`Dog ${imageIndex}`} />
                ))
              ) : (
                <p>No images found for {selectedBreed.value}.</p>
              )}
            </div>
          ))}
        </div>
        <a
          className="App-link"
          href="https://shufansun.github.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>Link to my personal website!</strong>
        </a>
      </div>
    );
  }
}

export default App;
