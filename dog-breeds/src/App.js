import './App.css';
import React, { Component } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import 'bootstrap/dist/css/bootstrap.min.css';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const animatedComponents = makeAnimated();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dogs: [],
      selectedBreeds: [],
      breedImages: {},
      imageData: { img: '', i: 0 }
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

  imgAction = (action) => {
    const { imageData, selectedBreeds, breedImages } = this.state;
    let { i } = imageData;

    if (action === 'next-img') {
      i = (i + 1) % selectedBreeds.length; // Wrap around to the first image if at the end
      this.setState({ imageData: { img: breedImages[selectedBreeds[i].value][0], i } });
    } else if (action === 'prev-img') {
      i = (i - 1 + selectedBreeds.length) % selectedBreeds.length; // Wrap around to the last image if at the beginning
      this.setState({ imageData: { img: breedImages[selectedBreeds[i].value][0], i } });
    }

    
};

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

  viewImage = (img, i) => {
    this.setState({ imageData: { img, i } });
  };

  render() {
    const { dogs, breedImages, selectedBreeds, imageData } = this.state;

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
          components={animatedComponents}
        />
        <button onClick={() => this.findByBreed()}>Find By Breed</button>
        {imageData.img && (
          <div style={{
            width: '100%',
            height: '100vh',
            background: 'black',
            position: 'fixed',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}>

            <button style={{position:'absolute',top:'10px',right:'10px'}}>X</button>
            <button onClick={()=>this.imgAction('prev-img')}>Previous</button>
            <img src={imageData.img} style={{ width: 'auto', maxWidth: '90%', maxHeight: '90%' }} alt={`Dog ${imageData.i}`} />
            <button onClick={()=>this.imgAction('next-img')}>Next</button>
          </div>
        )}
        <div id="listImageContainer">
          {selectedBreeds.map((selectedBreed, index) => (
            <div key={index}>
              <h2>{selectedBreed.value}</h2>
              {breedImages[selectedBreed.value] && breedImages[selectedBreed.value].length > 0 ? (
                <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
                  <Masonry gutter="20px">
                    {breedImages[selectedBreed.value].map((imageURL, imageIndex) => (
                      <img
                        key={imageIndex}
                        src={imageURL}
                        style={{ display: "block", maxWidth: "100%", height: "auto", cursor: 'pointer' }}
                        alt={`Dog ${imageIndex}`}
                        onClick={() => this.viewImage(imageURL, imageIndex)}
                      />
                    ))}
                  </Masonry>
                </ResponsiveMasonry>
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
