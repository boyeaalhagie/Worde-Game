import React from 'react';
import './App.css';
import axios from "axios";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RandomNumber/>
      </header>
    </div>
  );
}

interface IEmptyProps {}

interface IRandomNumState {
    message?: string;
}

class RandomNumber extends React.Component<IEmptyProps, IRandomNumState> {
    constructor(props: IEmptyProps) {
        super(props);
        this.state = {message: "Loading..."};
    }

    handleNumber(num: number) {
        let formattedNum = new Intl.NumberFormat().format(num);

        // Use state for anything that should update how the component is displayed
        this.setState({message: "Your random number is " + formattedNum + "!"});
    }

    handleError(msg: string) {
        this.setState({message: "There was an error! " + msg});
    }

    // Run when the component is initialized and "mounted"
    componentDidMount(){
        // Axios is our http request library
        // This call is asynchronous, needs .then()
        axios.get('http://localhost:8080/randomnumber')
            .then(r => {
                let randomNumber: number = r.data;
                this.handleNumber(randomNumber);
            }).catch(err => {
                this.handleError(err);
            });
    }

    render() {
        return <p>{this.state.message}</p>;
    }
}

export default App;
